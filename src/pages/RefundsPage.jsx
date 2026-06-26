import { useState } from 'react';
import { PageHeader, Badge, Button } from '../components';
import { refundStats } from '../data/pageStats';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import { orders } from '../api/mockData';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function RefundsPage() {
  const [search, setSearch] = useState('');
  
  // Create mock refunds
  const refunds = orders.slice(0, 6).map((o, idx) => ({
    id: `RFD-${1000 + idx}`,
    orderId: o.id,
    customer: o.customer,
    amount: o.total,
    date: o.date,
    status: idx % 3 === 0 ? 'processed' : 'pending'
  }));

  const filtered = refunds.filter(r => r.orderId.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Refunds" 
        description="Manage customer refunds and financial adjustments."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Payments' }, { label: 'Refunds' }]}
        stats={refundStats}
      />

      <div className="card flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Refund ID or Order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <Button variant="secondary">
          <HiOutlineFunnel className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Refund ID</th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date Requested</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-blue-600">{item.orderId}</td>
                  <td className="px-6 py-4">{item.customer.name}</td>
                  <td className="px-6 py-4">{formatDate(item.date)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === 'processed' ? 'success' : 'warning'} dot>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'pending' ? (
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Process</button>
                    ) : (
                      <button className="text-slate-400 hover:text-slate-600 text-xs font-semibold">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
