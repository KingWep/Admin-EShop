export default function DetailCard({ title, icon, badge, children }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 sm:p-8">
      {(title || badge) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">{icon}</div>}
            {title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}
          </div>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}