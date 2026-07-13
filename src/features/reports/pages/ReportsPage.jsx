import { useState } from 'react';
import ReportCharts from '../components/ReportCharts';
import DateRangePicker from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { Select } from '@/components/ui/Input';

import { PageHeader } from '@/components/ui';

export default function ReportsPage() {
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 days');

  return (
    <div>
      <PageHeader 
        title="Reports" 
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports' }]}
      >
        <ExportButton />
      </PageHeader>

      {/* Filters toolbar */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <div className="min-w-[160px]">
            <Select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
      </div>

      <ReportCharts />
    </div>
  );
}
