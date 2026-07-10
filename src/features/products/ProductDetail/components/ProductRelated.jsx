import { Link } from 'react-router-dom';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';
import { formatCurrency } from '../../../../utils/formatters';

const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

/**
 * Shows other products from the same sub-category.
 * `relatedProducts` comes straight from the store hook — normalize defensively
 * since the API may return either an array or a single object.
 */
export default function ProductRelated({ relatedProducts, currentProductId }) {
  const list = (Array.isArray(relatedProducts) ? relatedProducts : [relatedProducts])
    .filter(Boolean)
    .filter((p) => p.id !== currentProductId);

  if (list.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <HiOutlineSquares2X2 className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-bold text-slate-900">Related Products</h2>
      </div>
      <div className="space-y-3">
        {list.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            to={`/dashboard/products/view/${p.id}`}
            className="flex items-center gap-3 group -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <img
              src={p.main_image?.[0] || NO_IMAGE}
              alt={p.name}
              className="h-10 w-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
              onError={e => { e.currentTarget.src = NO_IMAGE; }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {p.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatCurrency((p.skus?.find(s => s.is_default) || p.skus?.[0])?.price || 0)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}