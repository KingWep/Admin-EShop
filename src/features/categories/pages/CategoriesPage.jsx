import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriesTable from '../components/CategoriesTable';
import { Button, PageHeader } from '@/components/ui';
import {  categoryStats  } from '@/features/reports/components/PageStats';
import { HiPlus } from 'react-icons/hi2';
import { categoryApi } from '@/features/categories/services/category.service';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(0);
  const [size] = useState(10);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryApi.getAll(page, size);
      const raw = Array.isArray(res) ? res : (res?.data ?? res?.content ?? res?.items ?? []);
      // console.log('Fetched categories:', raw);
      const list = raw
        .map(item => (item?.data != null ? item.data : item))
        .filter(item => item && item.id != null);
      setCategories(list);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleDelete = async (id) => {
    try {
      await categoryApi.delete(id);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Failed to delete category.');
      throw err;
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        crumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Products', path: '/dashboard/products' }, { label: 'Categories' }]}
        stats={categoryStats}
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => navigate('/dashboard/categories/add')}>
          <HiPlus className="h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading categories…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CategoriesTable
        categories={categories}
        onEdit={(cat) => navigate(`/dashboard/categories/edit/${cat.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
