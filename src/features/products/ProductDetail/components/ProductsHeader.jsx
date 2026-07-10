import { Link } from 'react-router-dom';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineChevronDown,
} from 'react-icons/hi2';

export default function ProductsHeader({
  product,
  deleteLoading,
  onDelete,
  moreOpen,
  setMoreOpen,
  moreRef,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          <span className="text-slate-300">›</span>
          <Link to="/dashboard/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <span className="text-slate-300">›</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-all"
          >
            More Actions
            <HiOutlineChevronDown className="h-4 w-4" />
          </button>
          {moreOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 overflow-hidden">
              <button
                onClick={onDelete}
                disabled={deleteLoading}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <HiOutlineTrash className="h-4 w-4" />
                {deleteLoading ? 'Deleting…' : 'Delete Product'}
              </button>
            </div>
          )}
        </div>
        <Link
          to={`/dashboard/products/edit/${product.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all"
        >
          <HiOutlinePencilSquare className="h-4 w-4" />
          Edit Product
        </Link>
        <Link
          to="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
}