import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCategories } from '@/features/categories/hooks/useCategories';

/**
 * BrandsFilter
 *
 * Props:
 *  - search       {string}   current search query
 *  - onSearch     {fn}       called with new search string
 *  - filters      {object}   { category: string }
 *  - onFilter     {fn}       called with (key, value)
 *  - onReset      {fn}       clears all active filters
 *  - hasActive    {boolean}  true when any filter/search is active
 */
export default function BrandsFilter({ search, onSearch, filters, onFilter, onReset, hasActive }) {
  const { categories } = useCategories();

  return (
    <div className="card mb-4">
      <div className="flex flex-wrap items-end gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Category filter */}
        <div className="min-w-[160px]">
          <Select
            value={filters.category || ''}
            onChange={e => onFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </div>

        {/* Reset */}
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
