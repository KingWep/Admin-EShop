import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../../api/modules/product.api';

const CRITERIA_TYPE_PRODUCT_ID = 5;
const CRITERIA_TYPE_SUB_CATEGORY = 2;

/**
 * useProductDetail
 *
 * All data-fetching and page-level state for the Product Detail screen:
 * - loads the product + its related-by-sub-category siblings
 * - manages the image gallery, tabs, delete flow, and the "More Actions" dropdown
 */
export function useProductDetail(id) {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productRes = await productApi.getAll({
          page: 1,
          size: 1,
          criteria_type: CRITERIA_TYPE_PRODUCT_ID,
          criteria_value: String(id),
        });

        if (cancelled) return;

        const productPayload = productRes.data;

        if (!productPayload || productPayload.length === 0) {
          throw new Error('Product not found.');
        }

        const currentProduct = Array.isArray(productPayload) ? productPayload[0] : productPayload;
        setProduct(currentProduct);

        if (currentProduct.sub_category_id) {
          const relatedRes = await productApi.getAll({
            page: 1,
            size: 1,
            criteria_type: CRITERIA_TYPE_SUB_CATEGORY,
            criteria_value: String(currentProduct.sub_category_id),
          });

          if (!cancelled) {
            setRelatedProducts(relatedRes.data);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllData();
    return () => { cancelled = true; };
  }, [id]);

  // Close "More Actions" dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await productApi.delete(id);
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Failed to delete product', err);
      setDeleteLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    activeImage,
    setActiveImage,
    deleteLoading,
    relatedProducts,
    activeTab,
    setActiveTab,
    moreOpen,
    setMoreOpen,
    moreRef,
    handleDelete,
    navigate,
  };
}

export default useProductDetail;