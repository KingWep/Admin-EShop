import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineChevronDown } from 'react-icons/hi2';
import ReturnsTable from '../components/ReturnsTable';
import {  returns as initialReturns  } from '@/features/dashboard/services/dashboard.service';
import Badge from '@/components/ui/Badge';
import { PageHeader, DataTableCard } from '@/components/ui';
import {  returnStats  } from '@/features/reports/components/PageStats';
import PageContainer from '@/components/layouts/PageContainer';
import { useNavigate } from 'react-router-dom';


export default function ReturnsPage() {
  const navigate = useNavigate();
  const [returns, setReturns] = useState(initialReturns);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredReturns = returns.filter(r => {
    const matchSearch = !search || 
      r.orderId.toLowerCase().includes(search.toLowerCase()) || 
      r.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    total: returns.length,
    requested: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    completed: returns.filter(r => r.status === 'completed').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
  };

  return (
    <PageContainer>
      <PageHeader
        title="Returns"
        description="Process and track customer product returns."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Returns' }]}
        stats={returnStats}
      />

      <DataTableCard
        toolbar={
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-5 sm:px-6 sm:flex-row sm:items-center flex-wrap rounded-t-xl">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status filter */}
            <div className="relative sm:w-44">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All Statuses</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Type filter */}
            <div className="relative sm:w-44">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All Types</option>
                <option value="return">Return</option>
                <option value="refund">Refund</option>
                <option value="exchange">Exchange</option>
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Filters button */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="relative flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                <HiOutlineFunnel className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        }
      >
        <ReturnsTable returns={filteredReturns} onView={(row) => navigate(`/dashboard/returns/${row.id}`)} />
      </DataTableCard>
    </PageContainer>
  );
}
