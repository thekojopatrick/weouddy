'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsTab {
  value: string;
  label: string;
}

interface SettingsTabsProps {
  tabs: SettingsTab[];
  defaultValue: string;
  children: React.ReactNode;
}

export function SettingsTabs({
  tabs,
  defaultValue,
  children,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-4">
      <TabsList className="h-auto flex-wrap gap-4 bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-gray-200 border border-transparent py-1.5 transition-all ease-linear data-[state=active]:shadow-sm "
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
