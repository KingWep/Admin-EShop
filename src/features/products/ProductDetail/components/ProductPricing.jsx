import { HiOutlineTag } from 'react-icons/hi2';
import { formatCurrency } from '../../../../utils/formatters';
import DetailCard from './DetailCard';
import { Field, CheckField } from './shared';

const skusHasVariants = (product) => (product.skus?.length || 0) > 1;

export default function ProductPricing({ product, defaultSku, totalStock }) {
  return (
    <DetailCard title="Pricing & Inventory" icon={<HiOutlineTag className="h-5 w-5" />}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
        <Field label="Regular Price" value={formatCurrency(defaultSku.price || 0)} />
        <Field label="Stock Quantity" value={`${totalStock} ${product.unit || ''}`} />
        <Field label="Unit" value={product.unit} />

        <Field label="Sale Price" value={defaultSku.sale_price != null ? formatCurrency(defaultSku.sale_price) : null} />
        <Field label="Low Stock Threshold" value={product.low_stock_threshold} />
        <Field label="Weight" value={product.weight ? `${product.weight} kg` : null} />

        <Field label="Cost Price" value={defaultSku.cost_price != null ? formatCurrency(defaultSku.cost_price) : null} />
        <CheckField label="Track Inventory" checked={!!product.track_inventory} />
        <Field label="Dimensions" value={product.dimensions} />

        <CheckField label="Has variants (size, color)" checked={skusHasVariants(product)} />
      </div>
    </DetailCard>
  );
}