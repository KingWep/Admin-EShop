// src/features/brands/pages/BrandsPage.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandsGrid from '../components/BrandsGrid';
import BrandsFilter from '../components/BrandsFilter';
import { Button, PageHeader } from '@/components/ui';
import { HiPlus } from 'react-icons/hi2';
import { brandStats } from '@/features/reports/components/PageStats';
import { brandService } from '@/features/brands/services/brand.service';
import PageContainer from '@/components/layouts/PageContainer';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(1);
  const [size] = useState(10);

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
      result = result.filter(b => String(b.category_id) === String(filters.category));
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
        stats={brandStats}
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => navigate('/dashboard/brands/add')}>
          <HiPlus className="h-4 w-4" />
          Add Brand
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <BrandsFilter
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={handleFilter}
        onReset={handleReset}
        hasActive={hasActive}
      />

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading brands…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <BrandsGrid
        brands={filteredBrands}
        onEdit={(brand) => navigate(`/dashboard/brands/edit/${brand.id}`)}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
