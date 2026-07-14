import { useState, useEffect, useCallback, useMemo } from 'react';
import PageContainer from '@/components/layouts/PageContainer';
import StatCards from '../components/StatCards';
import FilterBar from '../components/FilterBar';
import InventoryTable from '../components/InventoryTable';
import EditStockModal from '../components/EditStockModal';
import ViewStockDrawer from '../components/ViewStockDrawer';
import inventoryService from '../services/inventory.service';
import { PageHeader } from '@/components/ui';
function deriveStatus(availableQty, lowStockThreshold) {
  if (availableQty <= 0) return 'Out of Stock';
  if (availableQty <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
}


/**
 * Safely parse an ISO timestamp string from the API.
 * The server returns timestamps without the trailing "Z" (e.g. "2026-07-13T18:04:46.690005").
 * We append "Z" so the browser treats them as UTC and converts to local time correctly.
 */
function parseApiDate(isoString) {
  if (!isoString) return null;
  // Append Z only when there is no timezone info already
  const str = /[Zz]$|[+-]\d{2}:\d{2}$/.test(isoString) ? isoString : `${isoString}Z`;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/** Format a Date object to a readable date-time string including seconds. */
function fmtDateTime(date) {
  if (!date) return '—';
  return date.toLocaleString('en-US', {
    month:   'short',
    day:     'numeric',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    second:  '2-digit',
  });
}

/** Format a Date object to date-only string. */
function fmtDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

function normalizeItem(item) {
  const stockQty          = item.quantity          ?? 0;
  const reservedQty       = item.reservedQuantity  ?? 0;
  const availableQty      = item.availableQuantity ?? Math.max(0, stockQty - reservedQty);
  const lowStockThreshold = item.lowStockThreshold ?? 10;

  const name = item.productName ?? `SKU: ${item.sku ?? item.id}`;

  // Use lastRestockedAt first, fall back to updatedAt for "last updated" column
  const lastRestockedDate = parseApiDate(item.lastRestockedAt);
  const updatedAtDate     = parseApiDate(item.updatedAt);
  const createdAtDate     = parseApiDate(item.createdAt);

  return {
    id:               item.id,
    name,
    sku:              item.sku ?? '—',
    warehouse:        item.warehouseLocation ?? '—',
    stockQty,
    reservedQty,
    availableQty,
    lowStockThreshold,
    status:           deriveStatus(availableQty, lowStockThreshold),
    // Formatted for display — use real server timestamps
    lastUpdated:      fmtDateTime(lastRestockedDate ?? updatedAtDate),
    createdAt:        fmtDate(createdAtDate),
    // Raw ISO strings kept for tooltip / debugging
    lastRestockedAtRaw: item.lastRestockedAt ?? null,
    updatedAtRaw:       item.updatedAt       ?? null,
    createdAtRaw:       item.createdAt       ?? null,
  };
}

export default function InventoryPage() {
  const [rawData,        setRawData]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [page,           setPage]           = useState(0);   // 0-based (API)
  const [pageSize]                          = useState(10);
  const [totalPages,     setTotalPages]     = useState(1);
  const [totalElements,  setTotalElements]  = useState(0);

  const [selectedProduct,   setSelectedProduct]   = useState(null);
  const [isEditModalOpen,   setIsEditModalOpen]   = useState(false);
  const [isViewDrawerOpen,  setIsViewDrawerOpen]  = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // API: POST /api/v1/inventory/all/  →  { content: [{ data: {...} }], totalPages, totalElements }
      const res = await inventoryService.getAll(page, pageSize);
      // Each element inside `content` is wrapped in a `data` key
      const contentArray = res?.content ?? [];
      const raw = contentArray.map(entry => entry?.data).filter(Boolean);
      setRawData(raw);
      setTotalPages(res?.totalPages     ?? 1);
      setTotalElements(res?.totalElements ?? raw.length);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void fetchInventory();
  }, [fetchInventory]);

  // ── Normalised data ────────────────────────────────────────────────────────
  const data = useMemo(() => rawData.map(normalizeItem), [rawData]);

  // ── Derived stat counts (computed from real data) ──────────────────────────
  const statSummary = useMemo(() => ({
    total:      totalElements,
    inStock:    data.filter(d => d.status === 'In Stock').length,
    lowStock:   data.filter(d => d.status === 'Low Stock').length,
    outOfStock: data.filter(d => d.status === 'Out of Stock').length,
  }), [data, totalElements]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsViewDrawerOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsViewDrawerOpen(false);
  };

  const handleEditFromView = (product) => {
    setIsViewDrawerOpen(false);
    setTimeout(() => {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    }, 100);
  };

  // Re-fetch after a successful save
  const handleSaved = () => {
    handleCloseModals();
    void fetchInventory();
  };

  // Pagination: UI component uses 1-based, API uses 0-based
  const handlePageChange = (onePage) => {
    setPage(onePage - 1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        description="Manage stock levels and product availability."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Inventory' }]}
        stats={statSummary}
      />

      <div className="max-w-[1600px] mx-auto pb-10">
        <StatCards summary={statSummary} />

        <FilterBar />

        {loading && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Loading inventory…
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => void fetchInventory()}
              className="ml-4 text-xs font-medium text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">No inventory records found.</p>
          </div>
        )}

        {data.length > 0 && (
          <InventoryTable
            data={data}
            onViewClick={handleViewClick}
            onEditClick={handleEditClick}
            page={page + 1}          /* Pagination is 1-based */
            totalPages={totalPages}
            pageSize={pageSize}
            totalResults={totalElements}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        product={selectedProduct}
        onSaved={handleSaved}
      />

      <ViewStockDrawer
        isOpen={isViewDrawerOpen}
        onClose={handleCloseModals}
        product={selectedProduct}
        onEditClick={handleEditFromView}
      />
    </PageContainer>
  );
}
