import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products } from '../api/mockData';
import { PageHeader } from '../components';
import ProductForm from '../features/products/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  const handleSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate('/products');
  };

  if (!product) {
    return (
      <div className="card flex flex-col items-center py-20 text-center">
        <h3 className="text-lg font-semibold text-slate-700">Product not found</h3>
        <p className="mt-1 text-sm text-slate-400">The product with ID #{id} does not exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Edit Product" 
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Products', path: '/products' }, { label: 'Edit Product' }]}
      />

      <div className="card max-w-3xl">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
          loading={loading}
        />
      </div>
    </div>
  );
}
