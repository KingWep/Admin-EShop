import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandsGrid from '../features/brands/BrandsGrid';
import { Button, PageHeader } from '../components';
import { brands as initialBrands } from '../api/mockData';
import { HiPlus } from 'react-icons/hi2';
import { brandStats } from '../data/pageStats';

export default function BrandsPage() {
  const [brands, setBrands] = useState(initialBrands);
  const navigate = useNavigate();

  // In a real app, you'd fetch from API and update state
  const handleSave = (data) => {
    // ... logic handled by add/edit page and redux/context
  };

  const handleDelete = (brand) => {
    if (window.confirm(`Delete brand "${brand.name}"?`)) {
      setBrands(prev => prev.filter(b => b.id !== brand.id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage product brands and partnerships."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Brands' }]}
        stats={brandStats}
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => navigate('/brands/add')}>
          <HiPlus className="h-4 w-4" />
          Add Brand
        </Button>
      </PageHeader>

      <BrandsGrid
        brands={brands}
        onEdit={(brand) => navigate(`/brands/edit/${brand.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
