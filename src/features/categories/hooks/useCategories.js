import { useEffect, useState } from 'react';
import { categoryApi } from '@/features/categories/services/category.service';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await categoryApi.getAll(0, 100);
        const content = res?.content ?? [];
        const list = content
          .map(item => item?.data)
          .filter(item => item && item.id != null);
        setCategories(list);
      } catch {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  return {
    categories,
    loading,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    handleCategoryChange,
  };
}

export default useCategories;