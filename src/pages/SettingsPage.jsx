import SettingsForm from '../features/settings/SettingsForm';
import { PageHeader } from '../components';

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
