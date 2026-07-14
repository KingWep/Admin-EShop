import { useState, useEffect } from 'react';
import { X, Info, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import inventoryService from '../services/inventory.service';

/**
 * EditStockModal — lets admin restock or set exact quantity for an inventory record.
 *
 * Supported API operations:
 *   - Increase / Decrease  → PATCH /api/v1/inventory/restock?id=  body: { quantity }
 *   - Set Exact            → POST  /api/v1/inventory/exact?id=    body: { quantity, warehouse_location }
 *
 * Only fields accepted by the API are sent. Removed: lowStockThreshold, reservedQty,
 * reason, reference (none of these are accepted by restock or exact endpoints).
 */
export default function EditStockModal({ isOpen, onClose, product, onSaved }) {
  const [adjustQty,  setAdjustQty]  = useState('');
  const [adjustType, setAdjustType] = useState('increase'); // 'increase' | 'decrease' | 'exact'
  const [warehouse,  setWarehouse]  = useState('');
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState(null);

  // Reset form whenever the product or modal visibility changes
  useEffect(() => {
    if (product) {
      setWarehouse(product.warehouse ?? '');
      setAdjustQty('');
      setAdjustType('increase');
      setSaveError(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentStock = product.stockQty;
  const adjustValue  = parseInt(adjustQty || '0', 10);
  const newStock =
    adjustType === 'exact'
      ? adjustValue
      : adjustType === 'increase'
      ? currentStock + adjustValue
      : currentStock - adjustValue;

  const handleSave = async () => {
    if (!adjustQty) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (adjustType === 'exact') {
        // POST /api/v1/inventory/exact?id={id}  body: { quantity, warehouse_location }
        await inventoryService.adjust(product.id, {
          quantity:           adjustValue,
          warehouse_location: warehouse,
        });
      } else {
        // PATCH /api/v1/inventory/restock?id={id}  body: { quantity }
        const delta = adjustType === 'increase' ? adjustValue : -adjustValue;
        await inventoryService.restock(product.id, { quantity: delta });
      }
      onSaved?.();
    } catch (err) {
      console.error('Failed to update stock:', err);
      setSaveError(
        err?.response?.data?.message ?? 'Failed to update stock. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Stock</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {product.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Product Summary */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900">{product.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
            </div>
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0', {
              'bg-green-50 text-green-700': product.status === 'In Stock',
              'bg-amber-50 text-amber-700': product.status === 'Low Stock',
              'bg-red-50   text-red-700':   product.status === 'Out of Stock',
            })}>
              {product.status}
            </span>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

            {/* Current Stock — read only */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Stock</label>
              <input
                type="text"
                readOnly
                value={currentStock}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* New Stock — preview, read only */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Stock (Preview)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={newStock}
                  className="w-full pl-3 pr-14 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 font-semibold focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Units</span>
              </div>
            </div>

            {/* Quantity + Type — spans full width */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-slate-200 rounded-l-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 z-10"
                />
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-36 px-2 py-2 border border-l-0 border-slate-200 rounded-r-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option value="increase">Increase (+)</option>
                  <option value="decrease">Decrease (−)</option>
                  <option value="exact">Set Exact</option>
                </select>
              </div>
            </div>

            {/* Warehouse Location — only relevant for "exact" (sent as warehouse_location) */}
            {adjustType === 'exact' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Warehouse Location
                  <span className="ml-1 text-xs text-slate-400 font-normal">(sent to API as warehouse_location)</span>
                </label>
                <input
                  type="text"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  placeholder="e.g. Main Warehouse"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50/50 rounded-xl p-4 flex gap-3 border border-blue-100">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-0.5">
                {adjustType === 'exact'
                  ? 'Stock will be set to the exact quantity you enter.'
                  : 'Stock will be adjusted by the quantity you enter.'}
              </p>
              <p className="text-blue-700">Previous: <strong>{currentStock}</strong> → New: <strong>{newStock}</strong> units</p>
            </div>
          </div>

          {/* Error */}
          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !adjustQty}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Updating…' : 'Update Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
