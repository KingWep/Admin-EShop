import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductsTable from '../features/products/ProductsTable';
import ProductFilters from '../features/products/ProductFilters';
import { products as initialProducts } from '../api/mockData';
import { useSearch } from '../hooks/useSearch';
import { useFilter } from '../hooks/useFilter';
import { Button, PageHeader } from '../components';
import { HiPlus } from 'react-icons/hi2';
import { productStats } from '../data/pageStats';

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const { query, setQuery, debouncedQuery } = useSearch();
  const { filters, setFilter, resetFilters, hasActiveFilters } = useFilter({ category: '', status: '' });

  const filtered = products.filter(p => {
    const q = debouncedQuery.toLowerCase();
    const matchQuery = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchCategory = !filters.category || p.category === filters.category;
    const matchStatus = !filters.status || p.status === filters.status;
    return matchQuery && matchCategory && matchStatus;
  });

  const handleDelete = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  // You can keep your sleek single-line function here!
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product inventory and pricing."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Products' }]}
        stats={productStats}
      >
        <Link to="/products/add">
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

      {filtered.length === 0 && (
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

      {filtered.length > 0 && (
        <ProductsTable products={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
