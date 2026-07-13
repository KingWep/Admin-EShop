// src/features/brands/pages/BrandsPage.jsx
// Previously: features/subcategorie/pages/SubCategoryPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandsGrid from '../components/BrandsGrid';
import { Button, PageHeader } from '@/components/ui';
import { HiPlus } from 'react-icons/hi2';
import {  brandStats  } from '@/features/reports/components/PageStats';
import { brandService } from '@/features/brands/services/brand.service';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(1);
  const [size] = useState(10);
  // totalPages available in API response — reserved for future pagination UI
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

  return (
    <div>
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
        brands={brands}
        onEdit={(brand) => navigate(`/dashboard/brands/edit/${brand.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
