import { useState, useEffect } from 'react';
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { query, setQuery, debouncedQuery } = useSearch();
  const { filters, setFilter, resetFilters, hasActiveFilters } = useFilter({ category: '', status: '' });

  // Reset to page 0 whenever the search query changes
  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getAll({
          page: pageNumber,
          size: pageSize,
          criteria_type: 0,
          criteria_value: debouncedQuery || '',
        });
        if (isCancelled) return;

        // res = { code, data: { payload, total_pages, total_items, ... }, message }
        const { payload, total_pages, total_items } = res.data;
        setProducts(payload);
        setTotalPages(total_pages);
        setTotalItems(total_items);
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isCancelled = true; };
  }, [pageNumber, pageSize, debouncedQuery]);

  // Client-side filters for fields the backend search doesn't cover yet.
  const filtered = products.filter(p => {
    const matchCategory = !filters.category || p.category === filters.category;
    const matchStatus = !filters.status || p.is_active === (filters.status === 'active');
    return matchCategory && matchStatus;
  });

  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalItems(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === pageNumber) return;
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