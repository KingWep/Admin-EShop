import { cn } from '../../utils/cn';

/**
 * Responsive table with striped rows, hover effects, and sortable header UI.
 *
 * @param {Array} columns - [{ key, label, sortable, align, render }]
 * @param {Array} data - row data
 * @param {string} sortKey - current sort key
 * @param {'asc'|'desc'} sortDir
 * @param {function} onSort - (key) => void
 * @param {React.ReactNode} emptyState
 */
export default function Table({
  columns = [],
  data = [],
  sortKey,
  sortDir = 'asc',
  onSort,
  emptyState,
  className,
}) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-100', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.sortable && 'cursor-pointer select-none hover:text-slate-700'
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="flex flex-col">
                      <svg
                        className={cn('h-2.5 w-2.5', sortKey === col.key && sortDir === 'asc' ? 'text-indigo-600' : 'text-slate-300')}
                        viewBox="0 0 16 16" fill="currentColor"
                      >
                        <path d="M8 4l4 6H4z" />
                      </svg>
                      <svg
                        className={cn('h-2.5 w-2.5', sortKey === col.key && sortDir === 'desc' ? 'text-indigo-600' : 'text-slate-300')}
                        viewBox="0 0 16 16" fill="currentColor"
                      >
                        <path d="M8 12l4-6H4z" />
                      </svg>
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                {emptyState || (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No data found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className={cn(
                  'transition-colors duration-100 hover:bg-indigo-50/40',
                  rowIdx % 2 === 1 && 'bg-slate-50/50'
                )}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-sm text-slate-700',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
