// src/features/brands/pages/BrandsPage.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandStats from '../components/BrandStats';
import BrandToolbar from '../components/BrandToolbar';
import BrandTable from '../components/BrandTable';
import Pagination from '@/components/ui/Pagination';
import { PageHeader, Button, DataTableCard } from '@/components/ui';
import { HiPlus } from 'react-icons/hi2';
import { brandService } from '@/features/brands/services/brand.service';
import PageContainer from '@/components/layouts/PageContainer';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Filter state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '' });

  const hasActive = !!search || !!filters.category;

  const navigate = useNavigate();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await brandService.getAll(page, size);
      const raw = res?.data?.payload ?? [];

      const list = raw
        .filter(item => item && item.id != null)
        .map(item => ({
          id: item.id,
          name: item.name ?? 'Unnamed brand',
          logo: item.image ?? `https://placehold.co/64x64/1e293b/fff?text=${encodeURIComponent((item.name ?? 'B').slice(0, 2).toUpperCase())}`,
          category_id: item.category_id ?? null,
          category_name: item.category_name ?? 'Uncategorized',
          description: item.description ?? '',
          image: item.image ?? null,
          status: 'active',
        }));

      setBrands(list);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      setError('Failed to load brands.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id) => {
    const brand = brands.find(item => item.id === id);
    if (!brand) return;
    try {
      await brandService.delete(id);
      await fetchBrands();
    } catch (err) {
      console.error('Failed to delete brand:', err);
      setError('Failed to delete brand.');
    }
  };

  // Client-side filtering
  const filteredBrands = useMemo(() => {
    let result = brands;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category_name.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(b => String(b.category_id) === String(filters.category) || b.category_name === filters.category);
    }

    if (filters.status) {
      result = result.filter(b => b.status === filters.status);
    }

    return result;
  }, [brands, search, filters]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSearch('');
    setFilters({ category: '' });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Brands"
        description="Manage product brands and partnerships."
        crumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Brands' }]}
      >
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2" onClick={() => navigate('/dashboard/brands/add')}>
          <HiPlus className="h-4 w-4" />
          Add Brand
        </Button>
      </PageHeader>

      <BrandStats brands={brands} loading={loading} />

      <DataTableCard
        toolbar={
          <BrandToolbar
            search={search}
            onSearch={setSearch}
            filters={filters}
            onFilter={handleFilter}
          />
        }
        loading={loading}
        error={error}
        loadingMessage="Loading brands..."
        footer={
          <>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Rows per page:</span>
              <select 
                value={size} 
                onChange={(e) => setSize(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="w-full sm:w-auto overflow-hidden rounded-lg border border-slate-100">
              <Pagination
                pageNumber={page}
                totalPages={Math.max(1, Math.ceil(filteredBrands.length / size))}
                pageSize={size}
                totalResults={filteredBrands.length}
                onPageChange={setPage}
              />
            </div>
          </>
        }
      >
        <BrandTable
          brands={filteredBrands}
          onEdit={(brand) => navigate(`/dashboard/brands/edit/${brand.id}`)}
          onDelete={handleDelete}
          loading={loading}
        />
      </DataTableCard>
    </PageContainer>
  );
}
