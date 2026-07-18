import { PageHeader, DataTableCard } from '@/components/ui';
import PageContainer from '@/components/layouts/PageContainer';
import Pagination from '@/components/ui/Pagination';
import { paymentStats } from '../services/payment.service';
import PaymentStats from '../components/PaymentStats';
import PaymentToolbar from '../components/PaymentToolbar';
import PaymentTable from '../components/PaymentTable';
import { usePayments } from '../hooks/usePayments';

export default function PaymentsPage() {
  const {
    payments,
    loading,
    error,
    page,
    setPage,
    size,
    setSize,
    search,
    handleSearch,
    filters,
    handleFilter,
    totalResults
  } = usePayments();

  return (
    <PageContainer>
      <PageHeader
        title="Payment Details"
        description="Summary of all payments for the selected period"
        crumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Payment Details" }
        ]}
      />
      
      <PaymentStats stats={paymentStats} />

      <DataTableCard
        toolbar={
          <PaymentToolbar
            search={search}
            onSearch={handleSearch}
            filters={filters}
            onFilter={handleFilter}
          />
        }
        loading={loading}
        error={error}
        loadingMessage="Loading payments..."
        footer={
          <>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Rows per page:</span>
              <select 
                value={size} 
                onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="w-full sm:w-auto overflow-hidden rounded-lg border border-slate-100">
              <Pagination
                pageNumber={page}
                totalPages={Math.max(1, Math.ceil(totalResults / size))}
                pageSize={size}
                totalResults={totalResults}
                onPageChange={setPage}
              />
            </div>
          </>
        }
      >
        <PaymentTable
          payments={payments}
          loading={loading}
        />
      </DataTableCard>
    </PageContainer>
  );
}
