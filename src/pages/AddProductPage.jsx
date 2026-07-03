import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import ImageUploadInput from '../components/ui/ImageUploadInput';
import VariantsTable from '../components/ui/VariantsTable';
import { Card } from '../components/ui/Card';
import { categoryApi } from '../api/modules/category.api';
import { subCategoryApi } from '../api/modules/sub-category.api';
import { productApi } from '../api/modules/product.api';

export default function AddProductForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    shortDescription: '',
    description: '',
    regularPrice: '',
    salePrice: '',
    costPrice: '',
    stockQuantity: '',
    lowStockThreshold: '',
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const parseOptionalNumber = (value) => {
    if (value === '' || value == null) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError('');
        const res = await categoryApi.getAll(0, 100);
        const content = res?.content ?? [];
        console.log('Fetched categoriesv ergb:', content);
        const list = content
          .map(item => item?.data)
          .filter(item => item && item.id != null);
        setCategories(list);
      } catch (err) {
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([]);
      setSelectedSubCategoryId('');
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setLoadingSubCategories(true);
        setSelectedSubCategoryId('');
        const res = await subCategoryApi.getByCategoryId(selectedCategoryId);
        const raw = Array.isArray(res) ? res : (res?.data ?? res?.content ?? []);
        const list = raw
          .map(item => (item?.data != null ? item.data : item))
          .filter(item => item && item.id != null);
        setSubCategories(list);
      } catch (err) {
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleCancel = () => {
    navigate('/dashboard/products');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setSubmitError('Product name is required.');
      return;
    }

    if (!selectedSubCategoryId) {
      setSubmitError('Please choose a sub-category.');
      return;
    }

    const description = [form.shortDescription.trim(), form.description.trim()]
      .filter(Boolean)
      .join('\n\n');

    const skuData = {
      sku: form.sku.trim(),
      regular_price: parseOptionalNumber(form.regularPrice),
      sale_price: parseOptionalNumber(form.salePrice),
      cost_price: parseOptionalNumber(form.costPrice),
      stock_quantity: parseOptionalNumber(form.stockQuantity),
      low_stock_threshold: parseOptionalNumber(form.lowStockThreshold),
    };

    const skus = Object.fromEntries(
      Object.entries(skuData).filter(([, value]) => value !== '' && value !== undefined && value !== null)
    );

    try {
      setSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');

      await productApi.create({
        name: form.name.trim(),
        sub_category_id: Number(selectedSubCategoryId),
        description: description || undefined,
        skus: Object.keys(skus).length ? [skus] : [],
        files: productImages.map(item => item.file),
      });

      setSubmitSuccess('Product created successfully.');
      setForm({
        name: '',
        sku: '',
        shortDescription: '',
        description: '',
        regularPrice: '',
        salePrice: '',
        costPrice: '',
        stockQuantity: '',
        lowStockThreshold: '',
      });
      setProductImages([]);
      setSelectedCategoryId('');
      setSelectedSubCategoryId('');
      setSubCategories([]);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create product.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Add Product</h1>
          <p className="text-slate-500">Dashboard › Products › Add Product</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" loading={submitting}>Save Product</Button>
        </div>
      </div>

      {(submitError || submitSuccess) && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${submitError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {submitError || submitSuccess}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                placeholder="Nike Air Max 270"
                className="col-span-2"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
              <Input
                label="SKU *"
                placeholder="NK270-BLK-42"
                value={form.sku}
                onChange={(e) => updateField('sku', e.target.value)}
              />

              <Select
                label="Category *"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                error={categoryError || undefined}
                disabled={loadingCategories}
              >
                <option value="" className="text-black">
                  {loadingCategories ? 'Loading categories…' : '— Select category —'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Sub-Category *"
                value={selectedSubCategoryId}
                onChange={handleSubCategoryChange}
                disabled={!selectedCategoryId || loadingSubCategories}
              >
                <option value="">
                  {!selectedCategoryId
                    ? '— Select a category first —'
                    : loadingSubCategories
                      ? 'Loading…'
                      : subCategories.length === 0
                        ? 'No sub-categories found'
                        : '— Select sub-category —'}
                </option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </Select>

              <Textarea
                label="Short Description"
                className="col-span-2"
                value={form.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
              />
              <Textarea
                label="Description *"
                className="col-span-2"
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </Card>

          <Card title="Product Variants">
            <VariantsTable />
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <Card title="Pricing & Inventory">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Regular Price *"
                placeholder="$ 120.00"
                value={form.regularPrice}
                onChange={(e) => updateField('regularPrice', e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
              <Input
                label="Sale Price"
                placeholder="$ 100.00"
                value={form.salePrice}
                onChange={(e) => updateField('salePrice', e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
              <Input
                label="Cost Price"
                placeholder="$ 80.00"
                value={form.costPrice}
                onChange={(e) => updateField('costPrice', e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
              <Input
                label="Stock Quantity"
                value={form.stockQuantity}
                onChange={(e) => updateField('stockQuantity', e.target.value)}
                type="number"
                min="0"
              />
              <Input
                label="Low Stock Threshold"
                value={form.lowStockThreshold}
                onChange={(e) => updateField('lowStockThreshold', e.target.value)}
                type="number"
                min="0"
              />
            </div>
          </Card>

          <Card title="Product Images">
            <ImageUploadInput
              files={productImages}
              onFilesChange={setProductImages}
            />
          </Card>
        </div>
      </div>
    </form>
  );
}