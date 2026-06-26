import CustomersTable from '../features/customers/CustomersTable';
import { customers } from '../api/mockData';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useState } from 'react';
import { PageHeader } from '../components';
import { customerStats } from '../data/pageStats';

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader 
        title="Customers" 
        description="View and manage customer profiles and activity."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Customers' }]}
        stats={customerStats}
      />

      {/* Search */}
      <div className="card mb-4">
        <div className="relative max-w-sm">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <CustomersTable customers={filtered} />
    </div>
  );
}
