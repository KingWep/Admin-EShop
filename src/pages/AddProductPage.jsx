import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input, { Textarea, Select, Toggle } from '../components/ui/Input';
import Button from '../components/ui/Button';
import ImageUploadInput from '../components/ui/ImageUploadInput';
import { Card } from '../components/ui/Card';
import { categoryApi } from '../api/modules/category.api';
import { subCategoryApi } from '../api/modules/sub-category.api';
import { productApi } from '../api/modules/product.api';

const createAttributeGroup = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  values: [''],
});

const createVariant = (isDefault = false) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  description: '',
  price: '',
  is_default: isDefault,
  operatorProductAttribute: false,
  inventory_quantity: '',
  warehouse_location: '',
  product_attributes: [],
});

const parseOptionalNumber = (value) => {
  if (value === '' || value == null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};


const buildProductAttributes = (productAttributes) =>
  productAttributes
    .map((attribute) => {
      const name = attribute.name.trim();
      const values = attribute.values
        .map(value => value.trim())
        .filter(Boolean)
        .map(value => ({ id: null, value }));

      if (!name || values.length === 0) {
        return null;
      }

      return { id: null, name, attributes: values };
    })
    .filter(Boolean);

const buildSkuPayload = (variant) => ({
  productSkuId: null,
  description: variant.description.trim(),
  price: parseOptionalNumber(variant.price),
  quantity: parseOptionalNumber(variant.inventory_quantity),
  is_default: variant.is_default,
  operatorProductAttribute: variant.operatorProductAttribute,
  inventory: {
    quantity: parseOptionalNumber(variant.inventory_quantity),
    warehouse_location: variant.warehouse_location.trim(),
  },
  product_attributes: buildProductAttributes(variant.product_attributes),
});

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
  const [variants, setVariants] = useState([createVariant(true)]);

  const [isActive, setIsActive] = useState(true);

  // Only fields that swagger actually needs at product level + that the UI
  // truly uses. `is_active` removed from here — it already lives in `isActive`.
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const handleStatusChange = (e) => {
    setIsActive(e.target.value === 'true');
    setSubmitError('');
    setSubmitSuccess('');
  };

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const updateVariant = (variantId, key, value) => {
    setVariants(prev => prev.map(variant => (
      variant.id === variantId ? { ...variant, [key]: value } : variant
    )));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const updateVariantAttribute = (variantId, attributeId, key, value) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      return {
        ...variant,
        product_attributes: variant.product_attributes.map(attribute => (
          attribute.id === attributeId ? { ...attribute, [key]: value } : attribute
        )),
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const addAttributeValue = (variantId, attributeId) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      return {
        ...variant,
        product_attributes: variant.product_attributes.map(attribute => (
          attribute.id === attributeId
            ? { ...attribute, values: [...attribute.values, ''] }
            : attribute
        )),
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const updateAttributeValue = (variantId, attributeId, valueIndex, value) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      return {
        ...variant,
        product_attributes: variant.product_attributes.map(attribute => {
          if (attribute.id !== attributeId) {
            return attribute;
          }

          return {
            ...attribute,
            values: attribute.values.map((item, index) => (index === valueIndex ? value : item)),
          };
        }),
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const removeAttributeValue = (variantId, attributeId, valueIndex) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      return {
        ...variant,
        product_attributes: variant.product_attributes.map(attribute => {
          if (attribute.id !== attributeId) {
            return attribute;
          }

          const nextValues = attribute.values.filter((_, index) => index !== valueIndex);
          return {
            ...attribute,
            values: nextValues.length > 0 ? nextValues : [''],
          };
        }),
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const addVariant = () => {
    setVariants(prev => [...prev, createVariant(prev.length === 0)]);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const removeVariant = (variantId) => {
    setVariants(prev => {
      const next = prev.filter(variant => variant.id !== variantId);
      if (next.length === 0) {
        return [createVariant(true)];
      }

      if (!next.some(variant => variant.is_default)) {
        next[0] = { ...next[0], is_default: true };
      }

      return next;
    });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const addAttributeGroup = (variantId) => {
    setVariants(prev => prev.map(variant => (
      variant.id === variantId
        ? {
            ...variant,
            operatorProductAttribute: true,
            product_attributes: [...variant.product_attributes, createAttributeGroup()],
          }
        : variant
    )));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const removeAttributeGroup = (variantId, attributeId) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      const nextAttributes = variant.product_attributes.filter(attribute => attribute.id !== attributeId);
      return {
        ...variant,
        product_attributes: nextAttributes,
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleAttributeToggle = (variantId, enabled) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id !== variantId) {
        return variant;
      }

      return {
        ...variant,
        operatorProductAttribute: enabled,
        product_attributes: enabled
          ? (variant.product_attributes.length > 0 ? variant.product_attributes : [createAttributeGroup()])
          : [],
      };
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const setDefaultVariant = (variantId) => {
    setVariants(prev => prev.map(variant => ({
      ...variant,
      is_default: variant.id === variantId,
    })));
    setSubmitError('');
    setSubmitSuccess('');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError('');
        const res = await categoryApi.getAll(0, 100);
        const content = res?.content ?? [];
        const list = content
          .map(item => item?.data)
          .filter(item => item && item.id != null);
        setCategories(list);
      } catch {
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setLoadingSubCategories(true);
        setSelectedSubCategoryId('');
        const res = await subCategoryApi.getByCategoryId(selectedCategoryId);
        const raw = Array.isArray(res) ? res : (res?.data?.payload ?? res?.content ?? []);
        const list = raw
          .map(item => (item?.data != null ? item.data : item))
          .filter(item => item && item.id != null);
        setSubCategories(list);
      } catch {
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSubCategoryId('');
    setSubCategories([]);
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

    if (productImages.length === 0) {
      setSubmitError('Please upload at least one product image.');
      return;
    }

    if (!selectedSubCategoryId) {
      setSubmitError('Please choose a sub-category.');
      return;
    }

    const description = form.description.trim();

    const firstInvalidVariant = variants.find((variant) => {
      return !variant.description.trim()
        || parseOptionalNumber(variant.price) == null
        || parseOptionalNumber(variant.inventory_quantity) == null
        || !variant.warehouse_location.trim();
    });

    if (firstInvalidVariant) {
      setSubmitError('Each SKU needs a description, price, inventory quantity, and warehouse location.');
      return;
    }

    const invalidAttributeVariant = variants.find((variant) => {
      if (!variant.operatorProductAttribute) {
        return false;
      }

      return variant.product_attributes.some((attribute) => {
        if (!attribute.name.trim()) {
          return true;
        }

        return attribute.values.some(value => !value.trim());
      });
    });

    if (invalidAttributeVariant) {
      setSubmitError('Fill in every enabled product attribute name and value, or turn the switch off.');
      return;
    }

    const normalizedVariants = variants.map(buildSkuPayload);

    if (!normalizedVariants.some(variant => variant.is_default)) {
      setSubmitError('Choose one default SKU.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');

      await productApi.create({
        name: form.name.trim(),
        description: description || undefined,
        is_active: isActive,
        sub_category_id: Number(selectedSubCategoryId),
        skus: normalizedVariants,
        files: productImages,
      });

      setSubmitSuccess('Product created successfully.');
      setForm({
        name: '',
        description: '',
      });
      setProductImages([]);
      setVariants([createVariant(true)]);
      setSelectedCategoryId('');
      setSelectedSubCategoryId('');
      setSubCategories([]);
      setIsActive(true);
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

              <Textarea
                label="Description *"
                className="col-span-2"
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
              <div className="row-span-2 text-sm text-slate-500">
                <Select
                  label="Sub-Category *"
                  value={selectedSubCategoryId}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategoryId || loadingSubCategories}
                  className="mb-5"
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

                <Select
                  label="Status (Active) *"
                  value={isActive ? 'true' : 'false'}
                  onChange={handleStatusChange}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </Select>
              </div>
            </div>
          </Card>

          <Card title="Product Variants">
            <div className="space-y-6">
              <p className="text-sm text-slate-500">
                Add one or more SKUs for the same product. Each SKU can have its own price, inventory, and attribute set.
              </p>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">SKU {index + 1}</h3>
                        <p className="text-sm text-slate-500">Use this row to define one sellable variant.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name="default-sku"
                            checked={variant.is_default}
                            onChange={() => setDefaultVariant(variant.id)}
                            className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          Default SKU
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => removeVariant(variant.id)}
                          disabled={variants.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="SKU Description *"
                        placeholder="Black - 128GB"
                        className="col-span-2"
                        value={variant.description}
                        onChange={(e) => updateVariant(variant.id, 'description', e.target.value)}
                      />
                      <Input
                        label="Price *"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="999.99"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                      />
                      <Input
                        label="Inventory Quantity *"
                        type="number"
                        min="0"
                        placeholder="50"
                        value={variant.inventory_quantity}
                        onChange={(e) => updateVariant(variant.id, 'inventory_quantity', e.target.value)}
                      />
                      <Input
                        label="Warehouse Location *"
                        className="col-span-2"
                        placeholder="Warehouse A"
                        value={variant.warehouse_location}
                        onChange={(e) => updateVariant(variant.id, 'warehouse_location', e.target.value)}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Toggle
                          id={`variant-attributes-${variant.id}`}
                          checked={variant.operatorProductAttribute}
                          onChange={(checked) => handleAttributeToggle(variant.id, checked)}
                          label="Product Attributes"
                        />
                      </label>

                      {variant.operatorProductAttribute && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-sm font-semibold text-slate-800">Product Attributes</h4>
                            <Button type="button" variant="secondary" onClick={() => addAttributeGroup(variant.id)}>
                              Add Attribute
                            </Button>
                          </div>

                          {variant.product_attributes.length === 0 ? (
                            <p className="text-sm text-slate-500">No attributes yet. Turn the switch off to skip attributes.</p>
                          ) : (
                            <div className="space-y-3">
                              {variant.product_attributes.map((attribute) => (
                                <div key={attribute.id} className="rounded-lg border border-slate-200 bg-white p-3">
                                  <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-12 md:col-span-4">
                                      <Input
                                        label="Attribute Name"
                                        placeholder="Color"
                                        value={attribute.name}
                                        onChange={(e) => updateVariantAttribute(variant.id, attribute.id, 'name', e.target.value)}
                                      />
                                    </div>
                                    <div className="col-span-12 md:col-span-8 md:flex md:items-end md:justify-end">
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeAttributeGroup(variant.id, attribute.id)}
                                        className="w-full md:w-auto"
                                      >
                                        Remove Attribute
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                      <h5 className="text-sm font-medium text-slate-700">Values</h5>
                                      <Button type="button" variant="secondary" onClick={() => addAttributeValue(variant.id, attribute.id)}>
                                        Add Value
                                      </Button>
                                    </div>

                                    <div className="space-y-3">
                                      {attribute.values.map((value, valueIndex) => (
                                        <div key={`${attribute.id}-${valueIndex}`} className="flex items-end gap-3">
                                          <div className="flex-3">
                                            <Input
                                              label={valueIndex === 0 ? 'Value' : ''}
                                              placeholder="Black"
                                              value={value}
                                              onChange={(e) => updateAttributeValue(variant.id, attribute.id, valueIndex, e.target.value)}
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => removeAttributeValue(variant.id, attribute.id, valueIndex)}
                                            disabled={attribute.values.length === 1}
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="secondary" onClick={addVariant}>
                Add SKU
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
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