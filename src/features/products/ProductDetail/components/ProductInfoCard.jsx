import { HiOutlineInformationCircle } from 'react-icons/hi2';
import Badge from '../../../../components/ui/Badge';
import DetailCard from './DetailCard';
import { Field } from './shared';

const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

/** The image + name + quick-fields strip right under the header. */
export function ProductSummaryCard({ product, images, defaultSku, statusDef, totalStock }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5">
      <img
        src={images[0]}
        alt={product.name}
        className="h-24 w-24 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
        onError={e => { e.currentTarget.src = NO_IMAGE; }}
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-slate-900 truncate">{product.name}</h2>
        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
          {product.short_description || product.description || 'No description provided.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
          <Field label="SKU" value={defaultSku.sku} mono />
          <Field label="Brand" value={product.brand?.name} />
          <Field label="Category" value={product.category?.name} />
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Status</p>
            <Badge variant={statusDef.variant} dot>{statusDef.label}</Badge>
          </div>
          <Field label="Stock" value={`${totalStock} ${product.unit || 'units'}`} />
        </div>
      </div>
    </div>
  );
}

/** The "Basic Information" card in the Overview tab. */
export default function ProductInfoCard({ product, defaultSku }) {
  return (
    <DetailCard title="Basic Information" icon={<HiOutlineInformationCircle className="h-5 w-5" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <div className="space-y-5">
          <Field label="Product Name" value={product.name} />
          <Field label="Short Description" value={product.short_description} />
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{product.description || '—'}</p>
          </div>
        </div>
        <div className="space-y-5">
          <Field label="SKU (Stock Keeping Unit)" value={defaultSku.sku} mono />
          <Field label="Barcode" value={product.barcode} mono />
          <Field label="Brand" value={product.brand?.name} />
          <Field label="Category" value={product.category?.name} />
        </div>
      </div>
    </DetailCard>
  );
}