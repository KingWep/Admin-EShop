import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import OrderTimeline from './OrderTimeline';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';
import { HiOutlineUser, HiOutlineMapPin, HiOutlineCreditCard } from 'react-icons/hi2';
import { PageHeader } from '../../components';

export default function OrderDetail({ order }) {
  const orderStatus = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
  const payStatus = PAYMENT_STATUSES[order.paymentStatus] || PAYMENT_STATUSES.pending;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <PageHeader 
        title={`Order ${order.id}`}
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Orders', path: '/orders' }, { label: order.id }]}
      >
        <Badge variant={orderStatus.variant} dot>{orderStatus.label}</Badge>
        <Badge variant={payStatus.variant}>{payStatus.label}</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items + Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order items */}
          <div className="card">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Order Items</h3>
            <div className="divide-y divide-slate-50">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-slate-100" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">SKU: {item.sku} · Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-emerald-600">{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-indigo-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <HiOutlineUser className="h-4 w-4 text-slate-400" />
              Customer
            </h3>
            <div className="flex items-center gap-3">
              <img src={order.customer.avatar} alt={order.customer.name} className="h-10 w-10 rounded-full" />
              <div>
                <p className="font-medium text-slate-900">{order.customer.name}</p>
                <p className="text-xs text-slate-500">{order.customer.email}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{order.customer.phone}</p>
          </div>

          {/* Shipping address */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <HiOutlineMapPin className="h-4 w-4 text-slate-400" />
              Shipping Address
            </h3>
            <p className="text-sm text-slate-600">{order.shippingAddress}</p>
          </div>

          {/* Payment */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <HiOutlineCreditCard className="h-4 w-4 text-slate-400" />
              Payment
            </h3>
            <p className="text-sm text-slate-600">{order.paymentMethod}</p>
            <div className="mt-2">
              <Badge variant={payStatus.variant} dot>{payStatus.label}</Badge>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Order Timeline</h3>
            <OrderTimeline steps={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
