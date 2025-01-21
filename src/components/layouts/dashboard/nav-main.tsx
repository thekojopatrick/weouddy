'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
  activeItem,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
  activeItem: string;
  state?: 'expanded' | 'collapsed';
}) {
  return (
    <SidebarMenu className={`px-2 transition-all ease-in delay-500`}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={activeItem === item.url}
          >
            <a href={item.url} className="text-lg w-full">
              <item.icon size={32} scale={2} className="size-8" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
