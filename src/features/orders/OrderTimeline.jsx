import { cn } from '../../utils/cn';
import { HiCheckCircle } from 'react-icons/hi2';

export default function OrderTimeline({ steps }) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={idx} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  step.done
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-400'
                )}
              >
                {step.done ? (
                  <HiCheckCircle className="h-5 w-5" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn('my-1 w-0.5 flex-1', step.done ? 'bg-indigo-200' : 'bg-slate-100')}
                  style={{ minHeight: 24 }}
                />
              )}
            </div>
            {/* Content */}
            <div className={cn('pb-6 pt-1', isLast && 'pb-0')}>
              <p className={cn('text-sm font-semibold', step.done ? 'text-slate-900' : 'text-slate-400')}>
                {step.status}
              </p>
              <p className="text-xs text-slate-400">{step.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
