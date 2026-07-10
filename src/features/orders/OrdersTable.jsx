import { useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import { HiOutlineEye } from 'react-icons/hi2';
import { cn } from '../../utils/cn';
import OrderFilter from './OrderFilter';
import Pagination from '../../components/ui/Pagination';

const STATUS_TABS = [
  { key: 'all',        label: 'All Orders' },
  { key: 'pending',    label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped',    label: 'Shipped' },
  { key: 'completed',  label: 'Completed' },
  { key: 'cancelled',  label: 'Cancelled' },
];

export default function OrdersTable({ orders }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  const columns = [
    { key: 'id', label: 'Order ID',
      render: val => <span className="font-semibold text-indigo-600">{val}</span> },
    { key: 'customer', label: 'Customer',
      render: val => <span className="font-medium text-slate-800">{val}</span> },
    { key: 'date', label: 'Date', sortable: true,
      render: val => <span className="text-slate-500">{formatDate(val)}</span> },
    { key: 'items', label: 'Items', align: 'center',
      render: val => <span className="font-medium">{val}</span> },
    { key: 'status', label: 'Status',
      render: val => {
        const s = ORDER_STATUSES[val] || ORDER_STATUSES.pending;
        return <Badge variant={s.variant} dot>{s.label}</Badge>;
      },
    },
    { key: 'total', label: 'Total', align: 'right', sortable: true,
      render: val => <span className="font-semibold text-slate-900">{formatCurrency(val)}</span> },
    { key: 'actions', label: '', align: 'right',
      render: (_, row) => (
        <Link
          to={`/dashboard/orders/${row.id.replace('#', '')}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="View order"
        >
          <HiOutlineEye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} data={filtered} />
    </div>
  );
}
