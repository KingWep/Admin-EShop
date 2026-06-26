import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components';
import CustomerGroupsTable from '../features/customers/CustomerGroupsTable';
import { customerGroups, customerGroupStats } from '../api/mockCustomerGroups';
import { HiPlus } from 'react-icons/hi2';

export default function CustomerGroupsPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* ── Page header ── */}
      <PageHeader
        title="Customer Groups"
        crumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Customers', path: '/customers' },
          { label: 'Customer Groups' },
        ]}
      >
        <button 
          onClick={() => navigate('/customer-groups/add')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <HiPlus className="h-4 w-4" />
          Add Group
        </button>
      </PageHeader>

      {/* ── Table + stats ── */}
      <CustomerGroupsTable
        groups={customerGroups}
        stats={customerGroupStats}
        onEdit={(group) => navigate(`/customer-groups/edit/${group.id}`)}
      />
    </div>
  );
}
