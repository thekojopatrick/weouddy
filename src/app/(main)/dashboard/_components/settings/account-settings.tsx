"use client";

import { Separator } from "@/components/ui/separator";
import { SettingsTabs } from "./settings-tabs";
import { AvatarUpload } from "./profile/avatar-upload";
import { DangerZone } from "./profile/danger-zone";
import { PasswordForm } from "./profile/password-form";
import { PersonalInfoForm } from "./profile/personal-info-form";
import { SocialAccounts } from "./profile/social-accounts";
import { SettingsTabContent } from "./settings-tab-content";
import BillingPage from "./billing";
import MembersPage from "./partners";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import ConnectAccounts from "./profile/connect-accounts";

const settingsTabs = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "integrations", label: "Integrations" },
  { value: "preferences", label: "Preferences" },
  { value: "workspace", label: "Workspace" },
  { value: "billing", label: "Plan & Billing" },
  { value: "partners", label: "Partners" },
];

export default function AccountSettings() {
  return (
    <div className="container mx-auto p-4">
      <SettingsTabs tabs={settingsTabs} defaultValue="profile">
        <SettingsTabContent
          value="profile"
          title="Profile"
          description="Manage your name, password and account settings."
        >
          <div className="space-y-8">
            <AvatarUpload />
            <Separator />
            <PersonalInfoForm />
            <Separator />
            <PasswordForm />
            <Separator />
            <SocialAccounts />
            <Separator />
            <ConnectAccounts />
            <Separator />
            <DangerZone />
          </div>
        </SettingsTabContent>

        <SettingsTabContent
          value="notifications"
          title="Notifications"
          description="Manage your notification preferences."
        />

        <SettingsTabContent
          value="integrations"
          title="Integrations"
          description="Manage your connected applications and services."
        />

        <SettingsTabContent
          value="preferences"
          title="Preferences"
          description="Manage your application preferences."
        />

        <SettingsTabContent
          value="workspace"
          title="Workspace"
          description="Manage your workspace settings."
        />

        <SettingsTabContent
          value="billing"
          title="Plan & Billing"
          description="Manage your subscription and billing details."
          actionButton={
            <Button variant="outline" className="gap-1 shadow-xs rounded-xl">
              <Gift className="h-5 w-5" />
              Gift PRO
            </Button>
          }
        >
          <BillingPage />
        </SettingsTabContent>
        <SettingsTabContent
          value="partners"
          title="Partners"
          description="Manage your team members and their roles."
        >
          <MembersPage />
        </SettingsTabContent>
      </SettingsTabs>
    </div>
  );
}
