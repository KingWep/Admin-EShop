import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import Pagination from '@/components/ui/Pagination';

/**
 * InventoryTable — displays real inventory data from the API.
 *
 * Columns shown are strictly what the API provides:
 *   Product Name | SKU | Warehouse Location | Stock Qty | Reserved Qty | Available Qty | Low Stock Threshold | Status | Last Updated
 *
 * Removed columns that have no real API backing:
 *   Barcode, Stock Value
 */
export default function InventoryTable({
  data,
  onViewClick,
  onEditClick,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalResults,
  onPageChange,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold">
            <tr>
              <th className="px-5 py-4">Product / SKU</th>
              <th className="px-5 py-4">Warehouse</th>
              <th className="px-5 py-4">Stock Qty</th>
              <th className="px-5 py-4">Reserved Qty</th>
              <th className="px-5 py-4">Available Qty</th>
              <th className="px-5 py-4">Low Stock Threshold</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Last Updated</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">

                {/* Product / SKU */}
                <td className="px-5 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</p>
                  </div>
                </td>

                {/* Warehouse Location */}
                <td className="px-5 py-3 text-slate-600">{item.warehouse}</td>

                {/* Stock Qty */}
                <td className="px-5 py-3">{item.stockQty}</td>

                {/* Reserved Qty */}
                <td className="px-5 py-3 text-slate-500">{item.reservedQty}</td>

                {/* Available Qty — colour-coded */}
                <td className={cn('px-5 py-3 font-semibold', {
                  'text-green-600': item.availableQty > item.lowStockThreshold,
                  'text-amber-500': item.availableQty > 0 && item.availableQty <= item.lowStockThreshold,
                  'text-red-600':   item.availableQty === 0,
                })}>
                  {item.availableQty}
                </td>

                {/* Low Stock Threshold */}
                <td className="px-5 py-3">{item.lowStockThreshold}</td>

                {/* Status badge */}
                <td className="px-5 py-3">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', {
                    'bg-green-50 text-green-700': item.status === 'In Stock',
                    'bg-amber-50 text-amber-700': item.status === 'Low Stock',
                    'bg-red-50 text-red-700':     item.status === 'Out of Stock',
                  })}>
                    {item.status}
                  </span>
                </td>

                {/* Last Updated */}
                <td className="px-5 py-3 text-xs text-slate-500">{item.lastUpdated}</td>

                {/* Action menu */}
                <td className="px-5 py-3 text-center relative">
                  <ActionMenu
                    isOpen={openDropdownId === item.id}
                    onToggle={() => toggleDropdown(item.id)}
                    onView={() => { setOpenDropdownId(null); onViewClick(item); }}
                    onEdit={() => { setOpenDropdownId(null); onEditClick(item); }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <Pagination
        pageNumber={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalResults={totalResults}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function ActionMenu({ isOpen, onToggle, onView, onEdit }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
          <button onClick={onView} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Eye className="h-4 w-4 text-slate-400" />
            View
          </button>
          <button onClick={onEdit} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-slate-400" />
            Edit Stock
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
