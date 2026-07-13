import SettingsForm from '../components/SettingsForm';
import { PageHeader } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader 
        title="Settings" 
        crumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]}
      />
      <div className="max-w-3xl">
        <SettingsForm />
      </div>
    </div>
  );
}
