import { useState } from 'react';
import ReturnsTable from '../features/returns/ReturnsTable';
import { returns as initialReturns } from '../api/mockData';
import Badge from '../components/ui/Badge';
import { PageHeader } from '../components';
import { returnStats } from '../data/pageStats';

export default function ReturnsPage() {
  const [returns, setReturns] = useState(initialReturns);

  const handleApprove = (item) => {
    setReturns(prev => prev.map(r => r.id === item.id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (item) => {
    setReturns(prev => prev.map(r => r.id === item.id ? { ...r, status: 'rejected' } : r));
  };

  const counts = {
    total: returns.length,
    requested: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    completed: returns.filter(r => r.status === 'completed').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
  };

  return (
    <div>
      <PageHeader
        title="Returns"
        description="Process and track customer product returns."
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Returns' }]}
        stats={returnStats}
      />

      <ReturnsTable
        returns={returns}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
