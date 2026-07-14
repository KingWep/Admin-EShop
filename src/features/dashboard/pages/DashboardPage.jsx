import {
  HiOutlineShoppingBag, HiOutlineClipboardDocumentList,
  HiOutlineCurrencyDollar, HiOutlineUsers,
} from 'react-icons/hi2';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import OrdersChart from '../components/OrdersChart';
import RecentOrdersTable from '../components/RecentOrdersTable';
import {  dashboardStats, salesChartData, ordersChartData, orders  } from '@/features/dashboard/services/dashboard.service';
import { PageHeader } from '@/components/ui';
import PageContainer from '@/components/layouts/PageContainer';


export default function DashboardPage() {
  const recentOrders = orders.slice(0, 6);

  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard" 
        crumbs={[{ label: 'Dashboard' }]}
      />

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold">Welcome back, John 👋</h2>
        <p className="mt-1 text-blue-100">Here's what's happening with your store today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value={dashboardStats.totalSales}
          growth={dashboardStats.salesGrowth}
          color="indigo"
          isCurrency
          icon={<HiOutlineCurrencyDollar className="h-6 w-6" />}
        />
        <StatsCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          growth={dashboardStats.ordersGrowth}
          color="amber"
          icon={<HiOutlineClipboardDocumentList className="h-6 w-6" />}
        />
        <StatsCard
          title="Total Revenue"
          value={dashboardStats.totalRevenue}
          growth={dashboardStats.revenueGrowth}
          color="emerald"
          isCurrency
          icon={<HiOutlineShoppingBag className="h-6 w-6" />}
        />
        <StatsCard
          title="Total Customers"
          value={dashboardStats.totalCustomers}
          growth={dashboardStats.customersGrowth}
          color="violet"
          icon={<HiOutlineUsers className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={salesChartData} />
        </div>
        <div>
          <OrdersChart data={ordersChartData} />
        </div>
      </div>

      {/* Recent orders */}
      <RecentOrdersTable orders={recentOrders} />
    </PageContainer>
  );
}
