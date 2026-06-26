import { cn } from '../../utils/cn';

function SkeletonBlock({ className }) {
  return (
    <div className={cn('animate-pulse rounded bg-slate-200', className)} />
  );
}

/**
 * Skeleton card for stats cards.
 */
export function StatCardSkeleton() {
  return (
    <div className="card flex items-center gap-4">
      <SkeletonBlock className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-6 w-32" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

/**
 * Skeleton row for tables.
 */
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBlock className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton table (header + rows).
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <SkeletonBlock className="h-3 w-20 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Generic skeleton block.
 */
export default SkeletonBlock;
