import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/modules/product.api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PRODUCT_STATUSES } from '../utils/constants';
import Badge from '../components/ui/Badge';
import {
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineInformationCircle,
  HiOutlineChartBar,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi2';

const CRITERIA_TYPE_PRODUCT_ID = 5;
const CRITERIA_TYPE_Sub_Category = 2;
const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

useEffect(() => {
  let isCancelled = false;

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Fetch the main product first
      const productRes = await productApi.getAll({
        page: 1,
        size: 1,
        criteria_type: CRITERIA_TYPE_PRODUCT_ID,
        criteria_value: String(id),
      });

      if (isCancelled) return;

      const productPayload = productRes.data;
      
      // Ensure we actually have data before proceeding
      if (!productPayload || productPayload.length === 0) {
        throw new Error('Product not found.');
      }

      // Assuming getAll returns an array, grab the first item. 
      // (If your API returns a single object when size=1, remove the [0])
      const currentProduct = Array.isArray(productPayload) ? productPayload[0] : productPayload;
      setProduct(currentProduct);

      // 2. NOW fetch the related data using the retrieved sub_category_id
      if (currentProduct.sub_category_id) {
        const criteriaTwoRes = await productApi.getAll({
          page: 1,
          size: 1,
          criteria_type: CRITERIA_TYPE_Sub_Category,
          criteria_value: String(currentProduct.sub_category_id),
        });
        console.log("Related Products", criteriaTwoRes);
        
        if (!isCancelled) {
          setRelatedProducts(criteriaTwoRes.data);
        }
      }

    } catch (err) {
      if (!isCancelled) setError(err);
    } finally {
      if (!isCancelled) setLoading(false);
    }
  };

  fetchAllData();
  return () => { isCancelled = true; };
}, [id]);
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await productApi.delete(id);
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Failed to delete product', err);
      setDeleteLoading(false);
    }
  };

  // ── Loading Skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-6 w-64 bg-slate-200/70 rounded-md" />
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-slate-200/70 rounded-xl" />
            <div className="h-10 w-24 bg-slate-200/70 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="aspect-square rounded-3xl bg-slate-200/70" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 w-20 rounded-2xl bg-slate-200/70" />)}
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <div className="h-48 bg-slate-200/70 rounded-3xl" />
            <div className="h-64 bg-slate-200/70 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ─────────────────────────────────────────────────────────
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

  // ── Derived Data ────────────────────────────────────────────────────────
  const images = product.main_image?.length > 0 ? product.main_image : [NO_IMAGE];
  const defaultSku = product.skus?.find(s => s.is_default) || product.skus?.[0] || {};
  const statusKey = product.is_active ? 'active' : 'inactive';
  const statusDef = PRODUCT_STATUSES[statusKey] || PRODUCT_STATUSES.draft;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium px-2">
          <Link to="/dashboard/products" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50">
            <HiOutlineArrowLeft className="h-4 w-4" />
            Products
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 truncate max-w-[250px]">{product.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to={`/dashboard/products/edit/${product.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            Edit Product
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineTrash className="h-4 w-4" />
            {deleteLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left Column: Image Gallery ── */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm aspect-square group">
            <img
              src={images[activeImage] || NO_IMAGE}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={e => { e.currentTarget.src = NO_IMAGE; }}
            />
            <div className="absolute top-4 right-4 z-10">
              <Badge variant={statusDef.variant} dot className="shadow-lg backdrop-blur-md bg-white/90">
                {statusDef.label}
              </Badge>
            </div>
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl" />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 h-20 w-20 rounded-2xl overflow-hidden transition-all duration-200 ${
                    activeImage === i 
                      ? 'ring-2 ring-indigo-600 ring-offset-2' 
                      : 'ring-1 ring-slate-200 hover:ring-indigo-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} thumbnail ${i + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={e => { e.currentTarget.src = NO_IMAGE; }} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column: Details & Data ── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* 1. Header & Description Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            
            <div className="space-y-1 mb-6">
              <p className="text-xs font-bold tracking-wider text-indigo-500 uppercase">Product Details</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
              <p className="text-sm font-mono text-slate-400">ID: {product.id}</p>
            </div>

            {product.description && (
              <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-3xl">
                {product.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100/80">
              <InfoChip label="Category" value={product.category?.name || 'Uncategorized'} icon={<HiOutlineTag />} />
              <InfoChip label="Brand" value={product.brand?.name || 'No Brand'} icon={<HiOutlineCube />} />
              <InfoChip label="Date Added" value={product.created_at ? formatDate(product.created_at) : 'Unknown'} icon={<HiOutlineInformationCircle />} />
            </div>
          </div>

          {/* 2. Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Default Price" value={formatCurrency(defaultSku.price || 0)} color="indigo" />
            <StatCard 
              label="Total Stock" 
              value={product.skus?.reduce((sum, s) => sum + (s.quantity || 0), 0) ?? 0} 
              color={product.skus?.reduce((sum, s) => sum + (s.quantity || 0), 0) === 0 ? 'red' : 'emerald'} 
            />
            <StatCard label="SKU Variants" value={product.skus?.length || 0} color="amber" />
            <StatCard label="Status" value={product.is_active ? 'Active' : 'Inactive'} color={product.is_active ? 'emerald' : 'slate'} />
          </div>

          {/* 3. SKU Variants Table Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <HiOutlineChartBar className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Inventory & Pricing</h2>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                {product.skus?.length || 0} Variant{product.skus?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {product.skus && product.skus.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <th className="px-6 py-4">SKU Code</th>
                        <th className="px-6 py-4 text-right">Unit Price</th>
                        <th className="px-6 py-4 text-center">Stock Level</th>
                        <th className="px-6 py-4 text-center">Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {product.skus.map((sku, i) => (
                        <tr key={sku.id || i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-sm text-slate-700 font-medium">{sku.sku || '—'}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {formatCurrency(sku.price || 0)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              sku.quantity === 0 ? 'bg-red-50 text-red-700' :
                              sku.quantity < 20 ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {sku.quantity ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {sku.is_default
                              ? <HiCheckCircle className="h-6 w-6 text-indigo-500 mx-auto" />
                              : <span className="text-slate-300">—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <HiOutlinePhoto className="h-10 w-10 text-slate-300 mb-3" /> 
                <p className="text-sm font-medium text-slate-600">No SKU variants configured</p>
                <p className="text-xs text-slate-400 mt-1">Add variants to manage pricing and inventory.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Refined Sub-components ──────────────────────────────────────────────────

function InfoChip({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100 shadow-sm">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

const colorMap = {
  indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-200',
  emerald: 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-200',
  amber:   'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-200',
  red:     'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200',
  slate:   'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 border border-slate-200 shadow-slate-100',
};

function StatCard({ label, value, color = 'indigo' }) {
  // Slate needs dark text for contrast, others need white text based on the gradient map
  const isLight = color === 'slate';
  
  return (
    <div className={`rounded-2xl p-5 shadow-lg ${colorMap[color]} transition-transform hover:-translate-y-1 duration-300`}>
      <p className={`text-xs font-bold tracking-wide uppercase mb-2 ${isLight ? 'text-slate-500' : 'text-white/80'}`}>
        {label}
      </p>
      <p className="text-2xl font-extrabold tracking-tight truncate">
        {value}
      </p>
    </div>
  );
}