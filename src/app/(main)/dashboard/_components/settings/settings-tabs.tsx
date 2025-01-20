"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsTab {
  value: string
  label: string
}

interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultValue: string
  children: React.ReactNode
}

export function SettingsTabs({ tabs, defaultValue, children }: SettingsTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-4">
      <TabsList className="h-auto flex-wrap gap-4 bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}

