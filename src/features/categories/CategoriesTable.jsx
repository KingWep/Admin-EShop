import { useState } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { useModal } from '../../hooks/useModal';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import DeleteButton from '../../components/ui/DeleteButton';

export default function CategoriesTable({ categories, onEdit, onDelete }) {
  const confirmModal = useModal();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 500));
    onDelete?.(confirmModal.data?.id);
    setDeleting(false);
    confirmModal.close();
  };

  const columns = [
    {
      key: 'name', label: 'Category',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={val} className="h-9 w-9 rounded-lg object-cover" />
          <div>
            <p className="font-medium text-slate-900">{val}</p>
            <p className="text-xs text-slate-400">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description', label: 'Description',
      render: val => <span className="text-sm text-slate-500 line-clamp-1 max-w-xs">{val}</span>
    },
    {
      key: 'products', label: 'Products', align: 'center',
      render: val => <span className="font-semibold text-slate-700">{val}</span>
    },
    {
      key: 'status', label: 'Status',
      render: val => (
        <Badge variant={val === 'active' ? 'success' : 'default'} dot>
          {val === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit?.(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
          </button>
          <DeleteButton
            onConfirm={() => onDelete?.(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          />
          {/* <button
            onClick={() => confirmModal.open(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={categories} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleConfirm}
        loading={deleting}
        message={`Delete "${confirmModal.data?.name}"? All products in this category will be uncategorized.`}
      />
    </>
  );
}
