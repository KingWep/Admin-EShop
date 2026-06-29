import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriesTable from '../features/categories/CategoriesTable';
import { Button, PageHeader } from '../components';
import { categories as initialCategories } from '../api/mockData';
import { categoryStats } from '../data/pageStats';
import { HiPlus } from 'react-icons/hi2';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const navigate = useNavigate();

  const handleSave = (data) => {
    // API logic here
  };

  const handleDelete = (id) => setCategories(prev => prev.filter(c => c.id !== id));

  return (
    <div>
      <PageHeader 
        title="Categories" 
        crumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Products', path: '/dashboard/products' }, { label: 'Categories' }]}
        stats={categoryStats}
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => navigate('/dashboard/categories/add')}>
          <HiPlus className="h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      <CategoriesTable
        categories={categories}
        onEdit={(cat) => navigate(`/dashboard/categories/edit/${cat.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
