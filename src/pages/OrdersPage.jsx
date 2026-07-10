import OrdersTable from '../features/orders/OrdersTable';
import { orders } from '../api/mockData';
import { PageHeader } from '../components';
import { orderStats } from '../data/pageStats';
import OrderFilter from '../features/orders/OrderFilter';
import Pagination from '../components/ui/Pagination';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Orders' }]}
        stats={orderStats}
      />
      <OrderFilter />
      <OrdersTable orders={orders} />
      <Pagination pageNumber={1} totalPages={10} onPageChange={() => { }} />
    </div>
  );
}
