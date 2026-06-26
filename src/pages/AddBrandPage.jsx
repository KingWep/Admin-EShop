import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineGlobeAlt, HiOutlinePhoto, HiOutlineInformationCircle } from 'react-icons/hi2';
import Button from '../components/ui/Button';

export default function AddBrandPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    website: '',
    status: 'active',
    sortOrder: '',
  });

  // Fetch initial data if isEdit
  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setForm({
        name: 'Existing Brand',
        slug: 'existing-brand',
        description: 'This is an existing brand description.',
        category: 'Electronics',
        website: 'https://example.com',
        status: 'active',
        sortOrder: '0',
      });
    }
  }, [isEdit, id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Page Header (replicates the specific layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Brand' : 'Add Brand'}</h2>
          {/* Breadcrumbs for page header */}
          <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <span className="text-slate-300">›</span>
            <Link to="/brands" className="hover:text-blue-600 transition-colors">Brands</Link>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">{isEdit ? 'Edit Brand' : 'Add Brand'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/brands')} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            {isEdit ? 'Update Brand' : 'Save Brand'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Brand Information</h3>
            <p className="mb-6 mt-1 text-sm text-slate-500">Enter the details of the brand you want to add.</p>

            <div className="space-y-5">
              {/* Brand Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    placeholder="Enter brand slug"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full rounded-l-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button className="flex items-center rounded-r-lg border border-l-0 border-slate-200 bg-blue-50 px-4 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors">
                    Generate
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">A unique URL-friendly identifier (e.g. apple, samsung)</p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter brand description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-slate-400">{form.description.length}/500</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category (optional)</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </div>

              {/* Website */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Website
                </label>
                <div className="relative">
                  <HiOutlineGlobeAlt className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://www.example.com"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-slate-300">
                      {form.status === 'active' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === 'active'}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="hidden"
                    />
                    <span className="text-sm font-medium text-slate-900">Active</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-slate-300">
                      {form.status === 'inactive' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={form.status === 'inactive'}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="hidden"
                    />
                    <span className="text-sm text-slate-600">Inactive</span>
                  </label>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Active brands will be visible in the system.</p>
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  placeholder="Enter sort order (default: 0)"
                  value={form.sortOrder}
                  onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">Brands with lower values appear first.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Brand Logo Upload */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Brand Logo</h3>
            <p className="mb-4 mt-1 text-sm text-slate-500">Upload a logo for the brand.</p>

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 px-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
              <HiOutlineCloudArrowUp className="mb-3 h-8 w-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">Drag and drop your file here</p>
              <p className="my-2 text-xs text-slate-400">or</p>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-slate-50">
                Browse Files
              </button>
              <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-wide">
                PNG, JPG, SVG up to 2MB. Recommended size: 512x512px
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Preview</h3>
            <p className="mb-4 mt-1 text-sm text-slate-500">This is how the brand will appear.</p>
            
            <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-400 shadow-inner">
                <HiOutlinePhoto className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">
                {form.name || 'Brand Name'}
              </p>
              {form.status === 'active' && (
                <span className="mt-2 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-100">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Visibility Alert */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Brand visibility</p>
              <p className="mt-1 text-xs text-blue-600/90 leading-relaxed">
                Once saved, the brand will be available for selection while adding or editing products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
