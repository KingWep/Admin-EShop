import { HiOutlinePhoto, HiCheckCircle } from 'react-icons/hi2';

export function Field({ label, value, mono = false }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-semibold text-slate-800 truncate ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </p>
    </div>
  );
}

export function CheckField({ label, checked }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-4 w-4 rounded flex items-center justify-center border ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
        {checked && <HiCheckCircle className="h-3.5 w-3.5 text-white" />}
      </div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

export function EmptyState({ text, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">
      <HiOutlinePhoto className="h-10 w-10 text-slate-300 mb-3" />
      <p className="text-sm font-medium text-slate-600">{text}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}

export function InfoLine({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-slate-300 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xs font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}