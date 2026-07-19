import { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineChevronDown } from 'react-icons/hi2';
import ReturnsTable from '../components/ReturnsTable';
import Badge from '@/components/ui/Badge';
import { PageHeader, DataTableCard, TableSkeleton } from '@/components/ui';
import Pagination from '@/components/ui/Pagination';
import PageContainer from '@/components/layouts/PageContainer';
import { PackageX, CheckCircle, Clock, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReturns } from '../hooks/useReturns';
import { useReturnSummary } from '../hooks/useReturnSummary';

export default function ReturnsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    returns,
    totalElements,
    totalPages,
    loading,
    error,
    refetch,
  } = useReturns({
    page,
    size,
    criteria_type: 0,
    criteria_value: debouncedSearch
  });

  const { summary, loading: summaryLoading } = useReturnSummary();

  const dynamicStats = summary ? [
    { 
      label: 'Total Returns', 
      value: summary.total_returns ?? '0',
      iconBgColorClass: "bg-blue-100 text-blue-600",
      icon: <PackageX size={24} />
    },
    { 
      label: 'Processed Returns', 
      value: summary.processed_returns ?? '0',
      iconBgColorClass: "bg-emerald-100 text-emerald-600",
      icon: <CheckCircle size={24} />
    },
    { 
      label: 'Pending Returns', 
      value: summary.pending_returns ?? '0',
      iconBgColorClass: "bg-amber-100 text-amber-600",
      icon: <Clock size={24} />
    },
    { 
      label: 'Return Rate', 
      value: summary.return_rate != null ? `${summary.return_rate}%` : '0%',
      iconBgColorClass: "bg-purple-100 text-purple-600",
      icon: <Percent size={24} />
    }
  ] : [{}, {}, {}, {}];

  const filteredReturns = returns?.filter(r => {
    const matchStatus = !statusFilter || (r.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchType = !typeFilter || (r.return_type || '').toLowerCase() === typeFilter.toLowerCase();
    return matchStatus && matchType;
  }) || [];

  return (
    <PageContainer>
      <PageHeader
        title="Returns"
        description="Process and track customer product returns."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Returns' }]}
        stats={dynamicStats}
        loading={summaryLoading}
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
                <option value="rejected">Rejected</option>
                <option value="received">Received</option>
                <option value="inspecting">Inspecting</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="pending_inspection">Pending Inspection</option>
                <option value="in_progress">In Progress</option>
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
                <option value="refund">Refund</option>
                <option value="return">Return</option>
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
        footer={
          <Pagination
            pageNumber={page}
            totalPages={totalPages}
            pageSize={size}
            totalResults={totalElements}
            onPageChange={setPage}
          />
        }
      >
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={10} cols={9} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <ReturnsTable returns={filteredReturns} onView={(row) => navigate(`/dashboard/returns/${row.return_id}`)} />
        )}
      </DataTableCard>
    </PageContainer>
  );
}
