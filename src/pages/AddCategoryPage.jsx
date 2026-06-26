import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { HiOutlineCloudArrowUp, HiOutlinePhoto, HiOutlineInformationCircle } from 'react-icons/hi2';
import Button from '../components/ui/Button';

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
  });

  // Fetch initial data if isEdit
  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setForm({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic items and gadgets.',
        status: 'active',
      });
    }
  }, [isEdit, id]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      ...(!isEdit ? { slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {})
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
          {/* Breadcrumbs */}
          <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <span className="text-slate-300">›</span>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span className="text-slate-300">›</span>
            <Link to="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">{isEdit ? 'Edit Category' : 'Add Category'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/categories')} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            {isEdit ? 'Update Category' : 'Save Category'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Category Information</h3>
            <p className="mb-6 mt-1 text-sm text-slate-500">Enter the details of the category.</p>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={form.name}
                  onChange={handleNameChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. electronics"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">URL-friendly identifier (auto-generated from name)</p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Category description…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
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
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Category Image Upload */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Category Image</h3>
            <p className="mb-4 mt-1 text-sm text-slate-500">Upload an image for the category.</p>

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 px-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
              <HiOutlineCloudArrowUp className="mb-3 h-8 w-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">Drag and drop your file here</p>
              <p className="my-2 text-xs text-slate-400">or</p>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-slate-50">
                Browse Files
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Preview</h3>
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-slate-400 shadow-inner">
                <HiOutlinePhoto className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{form.name || 'Category Name'}</p>
                <p className="text-xs text-slate-500">/{form.slug || 'slug'}</p>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Category Usage</p>
              <p className="mt-1 text-xs text-blue-600/90 leading-relaxed">
                Products can be assigned to this category to help customers find what they're looking for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
