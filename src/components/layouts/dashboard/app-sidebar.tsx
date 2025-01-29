"use client";

import * as React from "react";
import {
  ArrowLeft,
  Calendar,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CurrentUser } from "@/types/prisma.types";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Insights",
      url: "/dashboard/insights",
      icon: HomeIcon,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: CurrentUser | null;
}) {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          className=""
          onClick={() => router.push("/discover")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href="/" className={state === "collapsed" ? "hidden" : "block"}>
          <Image
            src={isMobile ? "/brand/logomark.svg" : "/logo.svg"}
            alt={"WeOuddy"}
            className="object-cover"
            width={isMobile ? 32 : 80}
            height={isMobile ? 32 : 80}
          />
          <span className="text-xl font-bold sr-only">WeOuddy</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} activeItem={pathname} state={state} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
