import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineGlobeAlt } from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import DeleteButton from '../../components/ui/DeleteButton';

export default function BrandsGrid({ brands, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brands.map(brand => (
        <div
          key={brand.id}
          className="card group flex flex-col gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-14 w-14 rounded-xl object-cover border border-slate-100"
            />
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onEdit?.(brand)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <HiOutlinePencilSquare className="h-4 w-4" />
              </button>
              <DeleteButton
                onConfirm={() => onDelete?.(brand.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{brand.name}</h3>
              <Badge variant={brand.status === 'active' ? 'success' : 'default'}>
                {brand.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{brand.country}</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{brand.description}</p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{brand.products}</span> products
            </span>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
            >
              <HiOutlineGlobeAlt className="h-3.5 w-3.5" />
              Website
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
