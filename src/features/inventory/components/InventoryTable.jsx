import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import Table from '@/components/ui/Table';

export default function InventoryTable({
  data,
  onViewClick,
  onEditClick,
  loading,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const columns = [
    {
      key: 'product',
      label: 'Product / SKU',
      render: (_, item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</p>
        </div>
      ),
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      render: (_, item) => <span className="text-slate-600">{item.warehouse}</span>,
    },
    {
      key: 'stockQty',
      label: 'Stock Qty',
      render: (_, item) => item.stockQty,
    },
    {
      key: 'reservedQty',
      label: 'Reserved Qty',
      render: (_, item) => <span className="text-slate-500">{item.reservedQty}</span>,
    },
    {
      key: 'availableQty',
      label: 'Available Qty',
      render: (_, item) => (
        <span className={cn('font-semibold', {
          'text-green-600': item.availableQty > item.lowStockThreshold,
          'text-amber-500': item.availableQty > 0 && item.availableQty <= item.lowStockThreshold,
          'text-red-600':   item.availableQty === 0,
        })}>
          {item.availableQty}
        </span>
      ),
    },
    {
      key: 'lowStockThreshold',
      label: 'Low Stock Threshold',
      render: (_, item) => item.lowStockThreshold,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, item) => (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', {
          'bg-green-50 text-green-700': item.status === 'In Stock',
          'bg-amber-50 text-amber-700': item.status === 'Low Stock',
          'bg-red-50 text-red-700':     item.status === 'Out of Stock',
        })}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      render: (_, item) => <span className="text-xs text-slate-500">{item.lastUpdated}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      align: 'center',
      render: (_, item) => (
        <ActionMenu
          isOpen={openDropdownId === item.id}
          onToggle={() => toggleDropdown(item.id)}
          onView={() => { setOpenDropdownId(null); onViewClick(item); }}
          onEdit={() => { setOpenDropdownId(null); onEditClick(item); }}
        />
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      data={data} 
      loading={loading}
      emptyState={
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-slate-500">No inventory records found.</p>
        </div>
      }
    />
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
