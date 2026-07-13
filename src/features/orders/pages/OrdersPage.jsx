import { useState, useEffect } from 'react';
import OrdersTable from '../components/OrdersTable';
import { PageHeader } from '@/components/ui';
import { orderStats } from '@/features/reports/components/PageStats';
import OrderFilter from '../components/OrderFilter';
import Pagination from '@/components/ui/Pagination';
import { useOrders } from '../hooks/useOrders';
import { HiOutlineCalendarDays, HiOutlineChevronDown, HiOutlineArrowDownTray } from 'react-icons/hi2';

export default function OrdersPage() {
  const [params, setParams] = useState({
    page: 1,
    size: 10,
    status: 'all',
    search: '',
  });

  const { orders, loading, totalPages, summary, fetchOrders, updateOrderStatus, cancelOrder } = useOrders(params);

  // Map the real summary data to the stats array
  const mappedStats = orderStats.map(stat => {
    let newValue = stat.value;
    let badgeText = stat.badgeText;
    if (summary) {
      if (stat.label === "Total Orders") {
        newValue = summary.total_orders ?? summary.totalOrders ?? summary.total ?? stat.value;
        badgeText = ""; // Remove fake trend for now, or update if API provides it
      }
      if (stat.label === "Completed Orders") {
        newValue = summary.completed_orders ?? summary.completedOrders ?? summary.completed ?? stat.value;
        badgeText = "";
      }
      if (stat.label === "Pending Orders") {
        newValue = summary.pending_orders ?? summary.pendingOrders ?? summary.pending ?? stat.value;
        badgeText = "";
      }
      if (stat.label === "Cancelled Orders") {
        newValue = summary.cancelled_orders ?? summary.cancelledOrders ?? summary.cancelled ?? summary.canceled ?? stat.value;
        badgeText = "";
      }
    }
    return { ...stat, value: newValue, badgeText };
  });

  useEffect(() => {
    fetchOrders(params);
  }, [params, fetchOrders]);

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setParams(prev => ({ ...prev, ...newFilters, page: 1 })); // reset page on filter change
  };

  return (
    <div>
      <PageHeader
        title="History Order Details"
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Orders' }, { label: 'History Order Details' }]}
        stats={mappedStats}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
            <HiOutlineCalendarDays className="w-4 h-4 text-slate-500" />
            May 20, 2024 - May 26, 2024
            <HiOutlineChevronDown className="w-4 h-4 text-slate-400 ml-2" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Export
            <HiOutlineChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>
        </div>
      </PageHeader>
      
      <OrderFilter 
        search={params.search}
        onSearchChange={(search) => handleFilterChange({ search })}
        status={params.status}
        onStatusChange={(status) => handleFilterChange({ status })}
      />
      
      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Loading orders...</div>
      ) : (
        <>
          <OrdersTable 
            orders={orders} 
            onUpdateStatus={(id, status) => updateOrderStatus(id, status, params)}
            onCancel={(id, userId, reason) => cancelOrder(id, userId, reason, params)}
          />
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination 
                pageNumber={params.page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
