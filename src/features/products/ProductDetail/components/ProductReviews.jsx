import { HiOutlineStar } from 'react-icons/hi2';
import DetailCard from './DetailCard';
import { EmptyState } from './shared';

/**
 * Placeholder tab: there's currently no reviews field on the product payload.
 * Once `product.reviews` (or a dedicated endpoint) exists, replace the
 * EmptyState branch below with the actual list.
 */
export default function ProductReviews({ product }) {
  const reviews = product.reviews || [];

  return (
    <DetailCard title="Customer Reviews" icon={<HiOutlineStar className="h-5 w-5" />}>
      {reviews.length > 0 ? (
        <ul className="space-y-4">
          {reviews.map((r, i) => (
            <li key={r.id || i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{r.author || 'Anonymous'}</span>
                <span className="text-xs text-slate-400">{'★'.repeat(r.rating || 0)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState text="No reviews yet" subtext="Reviews will appear here once customers start rating this product." />
      )}
    </DetailCard>
  );
}