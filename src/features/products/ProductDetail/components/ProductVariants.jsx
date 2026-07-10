import { HiOutlineCube, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import Badge from '../../../../components/ui/Badge';
import { formatCurrency } from '../../../../utils/formatters';
import DetailCard from './DetailCard';
import { EmptyState } from './shared';

const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

export default function ProductVariants({ skus }) {
  return (
    <DetailCard
      title="Product Variants"
      icon={<HiOutlineCube className="h-5 w-5" />}
      badge={
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
          {skus.length} Variant{skus.length !== 1 ? 's' : ''}
        </span>
      }
    >
      {skus.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">Image</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skus.map((sku, i) => (
                  <tr key={sku.id || i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 font-medium">{sku.sku || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{sku.size || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        {sku.color_hex && (
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-slate-200"
                            style={{ backgroundColor: sku.color_hex }}
                          />
                        )}
                        {sku.color?.name || sku.color || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {formatCurrency(sku.price || 0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        sku.quantity === 0 ? 'bg-red-50 text-red-700' :
                        sku.quantity < 20 ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {sku.quantity ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <img
                        src={sku.image || NO_IMAGE}
                        alt=""
                        className="h-8 w-8 rounded-md object-cover mx-auto border border-slate-100"
                        onError={e => { e.currentTarget.src = NO_IMAGE; }}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={sku.is_active === false ? 'slate' : 'emerald'} dot>
                        {sku.is_active === false ? 'Inactive' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <HiOutlinePencilSquare className="h-4 w-4 hover:text-indigo-600 cursor-pointer transition-colors" />
                        <HiOutlineTrash className="h-4 w-4 hover:text-red-600 cursor-pointer transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState text="No SKU variants configured" subtext="Add variants to manage pricing and inventory." />
      )}
    </DetailCard>
  );
}