import { useState } from 'react';
import { PageHeader, Badge, Button } from '../components';
import { cancelationStats } from '../data/pageStats';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import { orders } from '../api/mockData';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function CancelationsPage() {
  const [search, setSearch] = useState('');
  
  // Create some mock canceled orders by transforming some of the existing ones
  const cancelations = orders.map(o => ({
    ...o,
    status: 'canceled',
    cancelReason: ['Customer requested', 'Out of stock', 'Fraud suspected'][Math.floor(Math.random() * 3)],
    cancelDate: o.date
  })).slice(0, 5);

  const filtered = cancelations.filter(c => c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Cancelations" 
        description="Review and process order cancelation requests."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Cancelations' }]}
        stats={cancelationStats}
      />

      {/* Toolbar */}
      <div className="card flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID..."
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
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Cancel Date</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{item.id}</td>
                  <td className="px-6 py-4">{item.customer.name}</td>
                  <td className="px-6 py-4">{formatDate(item.cancelDate)}</td>
                  <td className="px-6 py-4">
                    <Badge variant="danger" dot>{item.cancelReason}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(item.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">View Details</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No cancelations found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
