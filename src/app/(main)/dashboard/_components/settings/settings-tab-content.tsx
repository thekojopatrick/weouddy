import { TabsContent } from '@/components/ui/tabs';
import { SettingsCard } from './settings-card';

interface SettingsTabContentProps {
  value: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function SettingsTabContent({
  value,
  title,
  description,
  children,
}: SettingsTabContentProps) {
  return (
    <TabsContent value={value}>
      <SettingsCard title={title} description={description}>
        {children || <p>{title} settings coming soon...</p>}
      </SettingsCard>
    </TabsContent>
  );
}
