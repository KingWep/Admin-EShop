import { HiOutlineCube } from 'react-icons/hi2';
import DetailCard from './DetailCard';
import { Field, EmptyState } from './shared';

export default function ProductInventory({ skus, totalStock }) {
  return (
    <DetailCard title="Inventory Levels" icon={<HiOutlineCube className="h-5 w-5" />}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Field label="Total Stock" value={totalStock} />
        <Field label="Variants Tracked" value={skus.length} />
        <Field label="Out of Stock" value={skus.filter(s => (s.quantity || 0) === 0).length} />
      </div>
      {skus.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skus.map((sku, i) => (
                <tr key={sku.id || i}>
                  <td className="px-4 py-3 font-mono text-slate-700">{sku.sku || '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-800">{sku.quantity ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sku.quantity === 0 ? 'bg-red-50 text-red-700' :
                      sku.quantity < 20 ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {sku.quantity === 0 ? 'Out of stock' : sku.quantity < 20 ? 'Low stock' : 'In stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState text="No inventory data" />
      )}
    </DetailCard>
  );
}