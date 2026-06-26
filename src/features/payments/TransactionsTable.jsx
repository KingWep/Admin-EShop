// src/features/payments/TransactionsTable.jsx
import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import {
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiMiniArrowTrendingUp,
  HiMiniArrowTrendingDown,
} from 'react-icons/hi2';

// ── Payment method icons / labels ──────────────────────────────────────────────
const METHOD_ICONS = {
  visa: (
    <span className="inline-flex items-center gap-1.5">
      <span className="rounded px-1.5 py-0.5 text-[10px] font-black tracking-widest bg-blue-700 text-white">VISA</span>
    </span>
  ),
  mastercard: (
    <span className="inline-flex items-center gap-1">
      <span className="h-4 w-4 rounded-full bg-red-500 opacity-90" />
      <span className="h-4 w-4 -ml-2 rounded-full bg-yellow-400 opacity-80" />
    </span>
  ),
  paypal: (
    <span className="inline-flex items-center gap-1 font-bold text-blue-600 text-xs">
      <span className="text-blue-800">P</span>
      <span className="text-blue-500">P</span>
    </span>
  ),
  applepay: (
    <span className="inline-flex items-center text-slate-800 font-semibold text-xs tracking-tight">
      ⊛ Pay
    </span>
  ),
  stripe: (
    <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-indigo-600 text-white text-xs font-bold">
      S
    </span>
  ),
};

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  paid: { label: 'Successful', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed: { label: 'Failed', variant: 'danger' },
  refunded: { label: 'Refunded', variant: 'default' },
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, growth, prefix = '' }) {
  const isPositive = growth >= 0;
  return (
    <div className="card flex items-start gap-4 p-5">
      <div className={cn('flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white text-xl', iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 truncate">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-slate-900 tabular-nums">
          {prefix}{typeof value === 'number' && prefix === '$'
            ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : value.toLocaleString()}
        </p>
        <p className={cn('mt-1 flex items-center gap-1 text-xs font-medium',
          isPositive ? 'text-emerald-600' : 'text-red-500')}>
          {isPositive
            ? <HiMiniArrowTrendingUp className="h-3.5 w-3.5" />
            : <HiMiniArrowTrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(growth)}%
          <span className="text-slate-400 font-normal">vs May 13 – May 19, 2024</span>
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

export default function TransactionsTable({ transactions, stats }) {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // filter
  const filtered = transactions.filter(t => {
    const q = search.toLowerCase();
    const matchQ = !q ||
      t.id.toLowerCase().includes(q) ||
      t.orderId.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q) ||
      t.customer.email.toLowerCase().includes(q);
    const matchM = !method || t.method === method;
    const matchS = !status || t.status === status;
    return matchQ && matchM && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const formatTime = (dt) => {
    const d = new Date(dt);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-5">
      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon="💳" iconBg="bg-blue-500"
          label="Total Transactions"
          value={stats?.total?.count ?? 0}
          growth={stats?.total?.growth ?? 0}
        />
        <StatCard
          icon="✅" iconBg="bg-emerald-500"
          label="Successful Transactions"
          value={stats?.successful?.count ?? 0}
          growth={stats?.successful?.growth ?? 0}
        />
        <StatCard
          icon="⏳" iconBg="bg-amber-500"
          label="Pending Transactions"
          value={stats?.pending?.count ?? 0}
          growth={stats?.pending?.growth ?? 0}
        />
        <StatCard
          icon="✕" iconBg="bg-red-500"
          label="Failed Transactions"
          value={stats?.failed?.count ?? 0}
          growth={stats?.failed?.growth ?? 0}
        />
        <StatCard
          icon="$" iconBg="bg-purple-500"
          label="Total Amount"
          value={stats?.totalAmount?.value ?? 0}
          growth={stats?.totalAmount?.growth ?? 0}
          prefix="$"
        />
      </div>

      {/* ── Filters bar ── */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by transaction ID, order ID, customer..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Date range (static display) */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            📅 May 20, 2024 – May 26, 2024
          </button>

          {/* Method filter */}
          <select
            value={method}
            onChange={e => { setMethod(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Payment Methods</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="paypal">PayPal</option>
            <option value="applepay">Apple Pay</option>
            <option value="stripe">Stripe</option>
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="paid">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Filters button */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <HiOutlineFunnel className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50">
                {['Transaction ID', 'Order ID', 'Customer', 'Date & Time', 'Payment Method', 'Status', 'Amount', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : paginated.map(t => {
                const { date, time } = formatTime(t.datetime);
                const st = STATUS_MAP[t.status] || STATUS_MAP.pending;
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    {/* Transaction ID */}
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {t.id}
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-3 text-sm font-medium text-slate-600 whitespace-nowrap">
                      {t.orderId}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={t.customer.avatar}
                          alt={t.customer.name}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{t.customer.name}</p>
                          <p className="text-xs text-slate-400 truncate">{t.customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-slate-700">{date}</p>
                      <p className="text-xs text-slate-400">{time}</p>
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {METHOD_ICONS[t.method]}
                        <span className="text-xs text-slate-600">{t.methodDetail}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={st.variant} dot>{st.label}</Badge>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(t.amount)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        title="View details"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3">
          <p className="text-sm text-slate-500">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to{' '}
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length.toLocaleString()} results
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <HiOutlineChevronLeft className="h-4 w-4" />
            </button>

            {[...Array(Math.min(totalPages, 3))].map((_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium border transition-colors',
                    safePage === pg
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {pg}
                </button>
              );
            })}

            {totalPages > 3 && (
              <>
                <span className="px-1 text-slate-400">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium border transition-colors',
                    safePage === totalPages
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <HiOutlineChevronRight className="h-4 w-4" />
            </button>

            <select
              value={PAGE_SIZE}
              readOnly
              className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600"
            >
              <option>10 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
