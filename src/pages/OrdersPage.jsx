import OrdersTable from '../features/orders/OrdersTable';
import { orders } from '../api/mockData';
import { PageHeader } from '../components';
import { orderStats } from '../data/pageStats';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader 
        title="Orders" 
        description="Manage and track all customer orders."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Orders' }]}
        stats={orderStats}
      />
      <OrdersTable orders={orders} />
    </div>
  );
}
