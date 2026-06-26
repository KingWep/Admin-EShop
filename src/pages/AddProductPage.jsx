import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../features/products/ProductForm';
import { PageHeader } from '../components';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate('/products');
  };

  return (
    <div>
      <PageHeader 
        title="Add Product" 
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Products', path: '/products' }, { label: 'Add Product' }]}
      />

      <div className="card max-w-3xl">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
          loading={loading}
        />
      </div>
    </div>
  );
}
