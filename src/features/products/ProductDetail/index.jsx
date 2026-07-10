import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { HiOutlineEye, HiOutlineGlobeAlt, HiOutlineClock, HiOutlineUser, HiXCircle } from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/formatters';
import { PRODUCT_STATUSES } from '../../../utils/constants';

import { useProductDetail } from './ProductDetail.store';
import ProductsHeader from './components/ProductsHeader';
import ProductGallery from './components/ProductGallery';
import ProductInfoCard, { ProductSummaryCard } from './components/ProductInfoCard';
import ProductPricing from './components/ProductPricing';
import ProductInventory from './components/ProductInventoryTab';
import ProductVariants from './components/ProductVariants';
import ProductRelated from './components/ProductRelated';
import ProductReviews from './components/ProductReviews';
import DetailCard from './components/DetailCard';
import { Field, EmptyState, InfoLine } from './components/shared';

const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'variants', label: 'Variants' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'seo', label: 'SEO' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'activity', label: 'Activity Log' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    product,
    loading,
    error,
    activeImage,
    setActiveImage,
    deleteLoading,
    relatedProducts,
    activeTab,
    setActiveTab,
    moreOpen,
    setMoreOpen,
    moreRef,
    handleDelete,
  } = useProductDetail(id);

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-6 w-64 bg-slate-200/70 rounded-md" />
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-slate-200/70 rounded-xl" />
            <div className="h-10 w-28 bg-slate-200/70 rounded-xl" />
          </div>
        </div>
        <div className="h-32 bg-slate-200/70 rounded-2xl" />
        <div className="h-10 w-full bg-slate-200/70 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 bg-slate-200/70 rounded-3xl" />
            <div className="h-64 bg-slate-200/70 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-40 bg-slate-200/70 rounded-3xl" />
            <div className="h-32 bg-slate-200/70 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50/50 mb-6 ring-8 ring-red-50">
          <HiXCircle className="h-12 w-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Product</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error.message || 'We encountered an unexpected error while retrieving this product.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          Return to Products
        </button>
      </div>
    );
  }

  if (!product) return null;

  // ── Derived data ──────────────────────────────────────────────────────
  const images = product.main_image?.length > 0 ? product.main_image : [NO_IMAGE];
  const skus = product.skus || [];
  const defaultSku = skus.find(s => s.is_default) || skus[0] || {};
  const statusKey = product.is_active ? 'active' : 'inactive';
  const statusDef = PRODUCT_STATUSES[statusKey] || PRODUCT_STATUSES.draft;
  const totalStock = skus.reduce((sum, s) => sum + (s.quantity || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ProductsHeader
        product={product}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        moreRef={moreRef}
      />

      <ProductSummaryCard
        product={product}
        images={images}
        defaultSku={defaultSku}
        statusDef={statusDef}
        totalStock={totalStock}
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 -mb-px text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.key === 'variants' && <span className="ml-1 text-xs text-slate-400">({skus.length})</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: tab content */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'overview' && (
            <>
              <ProductInfoCard product={product} defaultSku={defaultSku} />
              <ProductPricing product={product} defaultSku={defaultSku} totalStock={totalStock} />
            </>
          )}
          {activeTab === 'variants' && <ProductVariants skus={skus} />}
          {activeTab === 'inventory' && <ProductInventory skus={skus} totalStock={totalStock} />}
          {activeTab === 'seo' && <SeoTab product={product} />}
          {activeTab === 'reviews' && <ProductReviews product={product} />}
          {activeTab === 'activity' && <ActivityTab product={product} />}
        </div>

        {/* Right: sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <ProductGallery images={images} activeImage={activeImage} setActiveImage={setActiveImage} productId={product.id} />
          <StatusPanel statusDef={statusDef} product={product} />
          <PublishingPanel product={product} />
          <SeoSummaryPanel product={product} />
          <QuickInfoPanel product={product} />
          <ProductRelated relatedProducts={relatedProducts} currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}

// ── Small panels kept local (not in the screenshot's file list) ─────────

function SeoTab({ product }) {
  return (
    <DetailCard title="Search Engine Optimization" icon={<HiOutlineGlobeAlt className="h-5 w-5" />}>
      <div className="space-y-5">
        <Field label="Meta Title" value={product.seo?.meta_title || `${product.name || ''}`} />
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Meta Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {product.seo?.meta_description || product.short_description || '—'}
          </p>
        </div>
        <Field label="URL Slug" value={product.seo?.slug || product.slug} mono />
      </div>
    </DetailCard>
  );
}

function ActivityTab({ product }) {
  const events = [
    product.created_at && { label: 'Product created', by: product.created_by?.name, at: product.created_at },
    product.updated_at && { label: 'Product updated', by: product.updated_by?.name, at: product.updated_at },
  ].filter(Boolean);

  return (
    <DetailCard title="Activity Log" icon={<HiOutlineClock className="h-5 w-5" />}>
      {events.length > 0 ? (
        <ul className="space-y-5">
          {events.map((ev, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{ev.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(ev.at)}{ev.by ? ` · by ${ev.by}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState text="No activity recorded yet" subtext="Full history requires an audit log endpoint." />
      )}
    </DetailCard>
  );
}

function StatusPanel({ statusDef, product }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Status & Visibility</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Status</p>
          <Badge variant={statusDef.variant} dot>{statusDef.label}</Badge>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Visibility</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <HiOutlineEye className="h-4 w-4 text-slate-400" />
            {product.is_active ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>
    </div>
  );
}

function PublishingPanel({ product }) {
  const featured = !!product.is_featured;
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Publishing</h2>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Featured Product</p>
          <p className="text-xs text-slate-400 mt-0.5">Display this product on the homepage</p>
        </div>
        <span
          title="Change this from the Edit Product page"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            featured ? 'bg-indigo-600' : 'bg-slate-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            featured ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </span>
      </div>
    </div>
  );
}

function SeoSummaryPanel({ product }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-4">SEO <span className="text-slate-400 font-medium">(Optional)</span></h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Meta Title</p>
          <p className="text-sm text-slate-700 truncate">{product.seo?.meta_title || product.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Meta Description</p>
          <p className="text-sm text-slate-700 line-clamp-2">
            {product.seo?.meta_description || product.short_description || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">URL Slug</p>
          <p className="text-sm font-mono text-slate-700 truncate">{product.seo?.slug || product.slug || '—'}</p>
        </div>
      </div>
    </div>
  );
}

function QuickInfoPanel({ product }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Info</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <InfoLine icon={<HiOutlineClock className="h-4 w-4" />} label="Created At" value={product.created_at ? formatDate(product.created_at) : '—'} />
        <InfoLine icon={<HiOutlineClock className="h-4 w-4" />} label="Updated At" value={product.updated_at ? formatDate(product.updated_at) : '—'} />
        <InfoLine icon={<HiOutlineUser className="h-4 w-4" />} label="Created By" value={product.created_by?.name || '—'} />
        <InfoLine icon={<HiOutlineUser className="h-4 w-4" />} label="Last Updated By" value={product.updated_by?.name || '—'} />
      </div>
    </div>
  );
}