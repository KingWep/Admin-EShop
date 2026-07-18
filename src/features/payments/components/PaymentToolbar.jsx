import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiArrowUpTray } from 'react-icons/hi2';

export default function PaymentToolbar({ search, onSearch, filters, onFilter }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800">Payment Details</h3>
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {/* Search */}
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, customer..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={e => onFilter('status', e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Status</option>
          <option value="PAID">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        {/* Method filter */}
        <select
          value={filters.method || ''}
          onChange={e => onFilter('method', e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Payment Methods</option>
          <option value="BAKONG">Bakong</option>
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">Mastercard</option>
          <option value="PAYPAL">PayPal</option>
          <option value="APPLEPAY">Apple Pay</option>
          <option value="UPI">UPI</option>
          <option value="STRIPE">Stripe</option>
        </select>

        {/* Filters button */}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors">
          <HiOutlineFunnel className="h-3.5 w-3.5" />
          Filters
        </button>

        {/* Export button */}
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
          <HiArrowUpTray className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
