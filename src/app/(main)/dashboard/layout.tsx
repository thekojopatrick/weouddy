import { ReactNode } from 'react';
import { AppSidebar } from '@/components/layouts/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import DashboardHeader from '@/components/layouts/dashboard/header';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <DashboardHeader />
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
}
