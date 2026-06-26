import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Input, { Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function CategoryModal({ isOpen, onClose, initialData, onSave }) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: val,
      ...(key === 'name' && !isEdit ? { slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}),
    }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.slug.trim()) e.slug = 'Slug is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    onSave?.({ ...initialData, ...form });
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add Category'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} loading={loading}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Electronics"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Slug"
          placeholder="e.g. electronics"
          value={form.slug}
          onChange={e => set('slug', e.target.value)}
          error={errors.slug}
          helperText="URL-friendly identifier (auto-generated from name)"
        />
        <Textarea
          label="Description"
          placeholder="Category description…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={e => set('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
    </Modal>
  );
}
