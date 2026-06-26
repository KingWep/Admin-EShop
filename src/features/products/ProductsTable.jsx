import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DeleteButton from '../../components/ui/DeleteButton';
import { ConfirmModal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatters';
import { PRODUCT_STATUSES } from '../../utils/constants';
import { useModal } from '../../hooks/useModal';
import {
  HiOutlinePencilSquare, HiOutlineTrash, HiPlus,
} from 'react-icons/hi2';

export default function ProductsTable({ products, onDelete }) {
  const navigate = useNavigate();
  const confirmModal = useModal();
  const [deleting, setDeleting] = useState(false);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...products].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (typeof a[sortKey] === 'string') return a[sortKey].localeCompare(b[sortKey]) * mul;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 600));
    onDelete?.(confirmModal.data?.id);
    setDeleting(false);
    confirmModal.close();
  };

  const columns = [
    {
      key: 'name', label: 'Product', sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={val} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
          <div>
            <p className="font-medium text-slate-900">{val}</p>
            <p className="text-xs text-slate-400">{row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'price', label: 'Price', sortable: true, align: 'right',
      render: val => <span className="font-semibold">{formatCurrency(val)}</span>
    },
    {
      key: 'stock', label: 'Stock', sortable: true, align: 'center',
      render: val => (
        <span className={val === 0 ? 'font-semibold text-red-600' : val < 20 ? 'font-semibold text-amber-600' : 'text-slate-700'}>
          {val === 0 ? 'Out of stock' : val}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: val => {
        const s = PRODUCT_STATUSES[val] || PRODUCT_STATUSES.draft;
        return <Badge variant={s.variant} dot>{s.label}</Badge>;
      },
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/products/edit/${row.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Edit"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
          </button>
          <DeleteButton
            onConfirm={() => onDelete?.(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
      {/* 2. Swap your old action button with DeleteButton */}
      {/* <DeleteButton
        onConfirm={() => onDelete?.(row.id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
      /> */}
      {/* <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        message={`Are you sure you want to delete "${confirmModal.data?.name}"? This action cannot be undone.`}
      /> */}
    </>
  );
}
