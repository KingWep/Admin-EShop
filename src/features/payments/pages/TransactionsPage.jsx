// src/pages/TransactionsPage.jsx
import { PageHeader } from '@/components/ui';
import TransactionsTable from '../components/TransactionsTable';
import {  paymentDetails, paymentStats  } from '@/features/payments/services/payment.service';
import { HiOutlineArrowDownTray, HiOutlineChevronDown } from 'react-icons/hi2';

export default function TransactionsPage() {
  return (
    <div>
      {/* ── Page header ── */}
      <PageHeader
        title="Transactions"
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Transactions' }]}
      >
        {/* Export button */}
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <HiOutlineArrowDownTray className="h-4 w-4" />
          Export
          <HiOutlineChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </PageHeader>

      {/* ── Table + stats ── */}
      <TransactionsTable
        transactions={paymentDetails}
        stats={paymentStats}
      />
    </div>
  );
}
