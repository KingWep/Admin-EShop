import { useState } from 'react';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import ImageUploadInput from '../components/ui/ImageUploadInput';
import VariantsTable from '../components/ui/VariantsTable';
import { Card } from '../components/ui/Card';

export default function EditProductsForm() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Edit Product</h1>
          <p className="text-slate-500">Dashboard  Products  Edit Product</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button>Update Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Product Name *" placeholder="Nike Air Max 270" className="col-span-2" />
              <Input label="SKU *" placeholder="NK270-BLK-42" />
              <Input label="Category *" />
              <Input label="Sub-Category *" />
              <Textarea label="Short Description" className="col-span-2" />
              <Textarea label="Description *" className="col-span-2" rows={5} />
            </div>
          </Card>



          <Card title="Product Variants">
            <VariantsTable /> {/* កន្លែងសម្រាប់ដាក់ Table គ្រប់គ្រង Variant */}
          </Card>
        </div>

        {/* Right Column (4 cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">          
          <Card title="Pricing & Inventory">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Regular Price *" placeholder="$ 120.00" />
              <Input label="Sale Price" placeholder="$ 100.00" />
              <Input label="Cost Price" placeholder="$ 80.00" />
            </div>
            <div className='grid grid-cols-2 gap-4 mt-5'>
              <Input label="Stock Quantity" />
              <Input label="Low Stock Threshold" />
            </div>
          </Card>
          
          <Card title="Product Images">
            <ImageUploadInput />
          </Card>
        </div>
      </div>
    </div>
  );
}