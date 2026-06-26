import { useParams, useNavigate } from 'react-router-dom';
import CustomerDetail from '../features/customers/CustomerDetail';
import { customers, orders } from '../api/mockData';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customers.find(c => c.id === parseInt(id));

  if (!customer) {
    return (
      <div className="card flex flex-col items-center py-20 text-center">
        <h3 className="text-lg font-semibold text-slate-700">Customer not found</h3>
        <button onClick={() => navigate('/customers')} className="mt-4 text-sm text-indigo-600 hover:underline">
          ← Back to Customers
        </button>
      </div>
    );
  }

  const customerOrders = orders.filter(o => o.customerId === customer.id);

  return <CustomerDetail customer={customer} orders={customerOrders} />;
}
