import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductsTable from '../features/products/ProductsTable';
import ProductFilters from '../features/products/ProductFilters';
import Pagination from '../components/ui/Pagination';
import { useSearch } from '../hooks/useSearch';
import { useFilter } from '../hooks/useFilter';
import { Button, PageHeader } from '../components';
import { HiPlus } from 'react-icons/hi2';
import { productStats } from '../data/pageStats';
import { productApi } from '../api/modules/product.api';

const CRITERIA_TYPE = {
  ALL: 0,
  NAME: 1,
  SUB_CATEGORY_ID: 2,
  CATEGORY_ID: 3,
  ACTIVE: 4,
  PRODUCT_ID: 5,
  PRODUCT_WITH_SKUS: 6,
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { query, setQuery, debouncedQuery } = useSearch();

  const initialFilters = useMemo(() => ({ category: '', status: '' }), []);
  const { filters, setFilter, resetFilters, hasActiveFilters } = useFilter(initialFilters);

  const { criteriaType, criteriaValue } = useMemo(() => {
    if (debouncedQuery) {
      return { criteriaType: CRITERIA_TYPE.NAME, criteriaValue: debouncedQuery };
    }
    if (filters.category) {
      return { criteriaType: CRITERIA_TYPE.CATEGORY_ID, criteriaValue: filters.category };
    }
    if (filters.status === 'active') {
      return { criteriaType: CRITERIA_TYPE.ACTIVE, criteriaValue: '' };
    }
    return { criteriaType: CRITERIA_TYPE.ALL, criteriaValue: '' };
  }, [debouncedQuery, filters.category, filters.status]);

  // Reset ទៅ page 1 រាល់ពេល search ឬ filter ប្តូរ
  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery, filters.category, filters.status]);

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getAll({
          page: pageNumber,
          size: pageSize,
          criteria_type: criteriaType,
          criteria_value: criteriaValue,
        });
        console.log("Product",res);
        if (isCancelled) return;
        
        const { payload, total_pages, total_items } = res.data;

        // Transform the nested API data into a flat format for the table
        const formattedProducts = payload.map(product => {
          // Find the default SKU variant, or fall back to the first variant
          const defaultSku = product.skus?.find(s => s.is_default) || product.skus?.[0] || {};
          
          return {
            id: product.id,
            name: product.name,
            // Fallback to a placeholder if main_image array is empty
            image: product.main_image?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
            sku: defaultSku.sku || 'N/A',
            price: defaultSku.price || 0,
            // Since quantity is null in your screenshot, we use 0 or defaultSku.quantity
            stock: defaultSku.quantity ?? 0, 
            is_active: product.is_active,
            // Add defaults or fallbacks for properties missing in this API chunk
            category: product.category?.name || 'N/A', 
            brand: product.brand?.name || 'N/A',
            createdAt: product.created_at || 'N/A'
          };
        });

        setProducts(formattedProducts);
        setTotalPages(total_pages);
        setTotalItems(total_items);
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [pageNumber, pageSize, criteriaType, criteriaValue]);
  // "inactive" មិនមាន criteria_type ដាច់ដោយឡែកទេ (មានតែ ACTIVE=4)
  // ដូច្នេះនៅតែត្រូវ filter "inactive" នៅ client-side
  const filtered = products.filter(p => {
    if (filters.status === 'inactive') return p.is_active !== true;
    return true;
  });

  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalItems(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete product', err);
      setError(null);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === pageNumber) return;
    setPageNumber(nextPage);
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product inventory and pricing."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Products' }]}
        stats={productStats}
      >
        <Link to="/dashboard/products/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <HiPlus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </PageHeader>

      <ProductFilters
        search={query}
        onSearch={setQuery}
        filters={filters}
        onFilter={setFilter}
        onReset={resetFilters}
        hasActive={hasActiveFilters}
      />

      {loading && (
        <div className="card flex items-center justify-center py-16 text-sm text-slate-400">
          Loading products…
        </div>
      )}

      {!loading && error && (
        <div className="card flex flex-col items-center py-16 text-center">
          <h3 className="text-base font-semibold text-red-600">Failed to load products</h3>
          <p className="mt-1 text-sm text-slate-400">{error.message || 'Something went wrong.'}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-700">No products found</h3>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <ProductsTable products={filtered} onDelete={handleDelete} />
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}