import { useState, useEffect, useCallback, useMemo } from 'react';
import PageContainer from '@/components/layouts/PageContainer';
import { PageHeader, DataTableCard } from '@/components/ui';
import StatCards from '../components/StatCards';
import Pagination from '@/components/ui/Pagination';
import FilterBar from '../components/FilterBar';
import InventoryTable from '../components/InventoryTable';
import EditStockModal from '../components/EditStockModal';
import ViewStockDrawer from '../components/ViewStockDrawer';
import inventoryService from '../services/inventory.service';

function deriveStatus(availableQty, lowStockThreshold) {
  if (availableQty <= 0) return 'Out of Stock';
  if (availableQty <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
}


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
        <StatCards summary={statSummary} loading={loading} />

        <DataTableCard
          toolbar={<FilterBar />}
          loading={loading}
          error={error}
          loadingMessage="Loading inventory..."
          footer={
            data.length > 0 && (
              <div className="w-full sm:w-auto overflow-hidden rounded-lg border border-slate-100">
                <Pagination
                  pageNumber={page + 1}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalResults={totalElements}
                  onPageChange={handlePageChange}
                />
              </div>
            )
          }
        >
          {!error && (
            <InventoryTable
              data={data}
              onViewClick={handleViewClick}
              onEditClick={handleEditClick}
              loading={loading}
            />
          )}
        </DataTableCard>
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
