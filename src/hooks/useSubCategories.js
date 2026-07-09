import { useEffect, useRef, useState } from 'react';
import { subCategoryApi } from '../api/modules/sub-category.api';

/**
 * useSubCategories
 *
 * Loads sub-categories for a given category id.
 *
 * @param {string|number} categoryId
 * @param {string|number|null} initialSubCategoryId - optional sub-category id
 *   to restore once its list has loaded. Used when hydrating an edit form
 *   from an existing product, where the sub-category is already known
 *   before the user has touched the dropdown. Only ever applied once.
 */
export function useSubCategories(categoryId, initialSubCategoryId = null) {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    // Any categoryId change (including the very first hydration) clears the
    // current selection. If this run is the one-time restore, it gets set
    // back below once the matching list has loaded.
    setSelectedSubCategoryId('');

    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    let cancelled = false;

    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const res = await subCategoryApi.getByCategoryId(categoryId);
        const raw = Array.isArray(res) ? res : (res?.data?.payload ?? res?.content ?? []);
        const list = raw
          .map(item => (item?.data != null ? item.data : item))
          .filter(item => item && item.id != null);

        if (cancelled) return;

        setSubCategories(list);

        const canRestore =
          !hasRestoredRef.current &&
          initialSubCategoryId != null &&
          list.some(sub => String(sub.id) === String(initialSubCategoryId));

        if (canRestore) {
          setSelectedSubCategoryId(String(initialSubCategoryId));
          hasRestoredRef.current = true;
        }
      } catch {
        if (!cancelled) {
          setSubCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSubCategories();

    return () => {
      cancelled = true;
    };
  }, [categoryId, initialSubCategoryId]);

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
  };

  return {
    subCategories,
    loading,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    handleSubCategoryChange,
  };
}

export default useSubCategories;