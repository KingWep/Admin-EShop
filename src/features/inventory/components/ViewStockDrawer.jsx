import { X, Edit2 } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * ViewStockDrawer — shows details for one inventory record.
 *
 * Only displays fields that are actually returned by the API:
 *   name, sku, warehouse, stockQty, reservedQty, availableQty,
 *   lowStockThreshold, status, lastUpdated, createdAt
 *
 * Removed fields with no API backing:
 *   barcode, category, brand, imageUrl, history[], warehouseStock[]
 */
export default function ViewStockDrawer({ isOpen, onClose, product, onEditClick }) {
  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">View Stock</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Product Summary */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight text-base">{product.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
              <p className="text-xs text-slate-500 mt-0.5">{product.warehouse}</p>
            </div>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider flex-shrink-0', {
              'bg-green-50 text-green-700': product.status === 'In Stock',
              'bg-amber-50 text-amber-700': product.status === 'Low Stock',
              'bg-red-50   text-red-700':   product.status === 'Out of Stock',
            })}>
              {product.status}
            </span>
          </div>

          {/* Quantity Grid — 2 × 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Stock Qty</p>
              <p className="text-xl font-bold text-slate-900">{product.stockQty}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Reserved Qty</p>
              <p className="text-xl font-bold text-slate-900">{product.reservedQty}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Available Qty</p>
              <p className={cn('text-xl font-bold', {
                'text-green-600': product.availableQty > product.lowStockThreshold,
                'text-amber-500': product.availableQty > 0 && product.availableQty <= product.lowStockThreshold,
                'text-red-600':   product.availableQty === 0,
              })}>
                {product.availableQty}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Low Stock Threshold</p>
              <p className="text-xl font-bold text-slate-900">{product.lowStockThreshold}</p>
            </div>
          </div>

          {/* Details — only real API fields */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Warehouse</span>
                <span className="text-slate-900 font-medium">{product.warehouse}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500">SKU</span>
                <span className="font-mono text-slate-900">{product.sku}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Last Restocked</span>
                <span
                  className="text-slate-900 tabular-nums"
                  title={product.lastRestockedAtRaw ?? product.updatedAtRaw ?? ''}
                >
                  {product.lastUpdated}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Created</span>
                <span
                  className="text-slate-900 tabular-nums"
                  title={product.createdAtRaw ?? ''}
                >
                  {product.createdAt}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0">
          <button
            onClick={() => onEditClick(product)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
            Edit Stock
          </button>
        </div>
      </div>
    </>
  );
}
