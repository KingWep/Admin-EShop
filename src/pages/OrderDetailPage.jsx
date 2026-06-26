import { useParams, useNavigate } from 'react-router-dom';
import OrderDetail from '../features/orders/OrderDetail';
import { orderDetail } from '../api/mockData';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, fetch by id. Use the mock detail for demo.
  const order = { ...orderDetail, id: `#${id}` };

  return <OrderDetail order={order} />;
}
