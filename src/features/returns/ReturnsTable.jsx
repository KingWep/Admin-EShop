import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RETURN_STATUSES } from '../../utils/constants';
import { cn } from '../../utils/cn';

const TYPE_COLORS = {
  return:   { bg: 'bg-red-50',    text: 'text-red-700'   },
  refund:   { bg: 'bg-amber-50',  text: 'text-amber-700' },
  exchange: { bg: 'bg-blue-50',   text: 'text-blue-700'  },
};

export default function ReturnsTable({ returns: items, onApprove, onReject }) {
  const columns = [
    { key: 'id', label: 'Return ID',
      render: val => <span className="font-semibold text-slate-700 font-mono text-sm">{val}</span> },
    { key: 'orderId', label: 'Order',
      render: val => <span className="font-semibold text-indigo-600">{val}</span> },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product',
      render: val => <span className="font-medium text-slate-700">{val}</span> },
    { key: 'type', label: 'Type',
      render: val => {
        const c = TYPE_COLORS[val] || TYPE_COLORS.return;
        return (
          <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold capitalize', c.bg, c.text)}>
            {val}
          </span>
        );
      },
    },
    { key: 'reason', label: 'Reason',
      render: val => <span className="text-sm text-slate-500 max-w-[180px] truncate block">{val}</span> },
    { key: 'status', label: 'Status',
      render: val => {
        const s = RETURN_STATUSES[val] || RETURN_STATUSES.requested;
        return <Badge variant={s.variant} dot>{s.label}</Badge>;
      },
    },
    { key: 'amount', label: 'Amount', align: 'right',
      render: val => <span className="font-semibold">{formatCurrency(val)}</span> },
    { key: 'actions', label: 'Actions', align: 'right',
      render: (_, row) => row.status === 'requested' ? (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="success" onClick={() => onApprove?.(row)}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => onReject?.(row)}>Reject</Button>
        </div>
      ) : null,
    },
  ];

  return <Table columns={columns} data={items} />;
}
