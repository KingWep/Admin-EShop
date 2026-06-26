import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';

export default function RecentOrdersTable({ orders }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">Latest customer orders</p>
        </div>
        <Link
          to="/orders"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Order</th>
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</th>
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => {
              const statusDef = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
              return (
                <tr key={order.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="py-3 pr-4">
                    <Link
                      to={`/orders/${order.id.replace('#', '')}`}
                      className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-slate-700">{order.customer}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-slate-500">{formatDate(order.date)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusDef.variant} dot>
                      {statusDef.label}
                    </Badge>
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
