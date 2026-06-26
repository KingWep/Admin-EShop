import { cn } from '../../utils/cn';
import { formatCompact, formatPercent } from '../../utils/formatters';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

const colorMap = {
  indigo:  { bg: 'bg-indigo-50',  icon: 'bg-indigo-600',  text: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', text: 'text-emerald-600' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-600',   text: 'text-amber-600' },
  violet:  { bg: 'bg-violet-50',  icon: 'bg-violet-600',  text: 'text-violet-600' },
};

/**
 * Dashboard stats card.
 * @param {string} title
 * @param {number} value
 * @param {number} growth - percentage growth (positive or negative)
 * @param {React.ReactNode} icon
 * @param {'indigo'|'emerald'|'amber'|'violet'} color
 * @param {boolean} isCurrency
 */
export default function StatsCard({ title, value, growth, icon, color = 'indigo', isCurrency = false }) {
  const colors = colorMap[color] || colorMap.indigo;
  const isPositive = growth >= 0;

  return (
    <div className="card group flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', colors.icon)}>
        <span className="text-white">{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-0.5 text-2xl font-bold text-slate-900">
          {isCurrency ? '$' : ''}
          {formatCompact(value)}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          {isPositive ? (
            <HiArrowTrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <HiArrowTrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={cn('text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
            {formatPercent(growth)}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
}
