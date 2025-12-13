"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ClipboardListIcon,
  BarChart3Icon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  MessageCircleIcon,
  SettingsIcon,
  GlobeIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavQuickLinks } from "@/components/nav-quick-links";
import { NavUser } from "@/components/nav-user";
import { BrandSwitcher } from "@/components/brand-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// VisaPath navigation data
const data = {
  user: {
    name: "Guest User",
    email: "guest@visapath.ai",
    avatar: "",
  },
  brand: {
    name: "VisaPath AI",
    logo: GlobeIcon,
    plan: "Free Plan",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Analysis",
      url: "#",
      icon: SparklesIcon,
      items: [
        {
          title: "New Analysis",
          url: "/dashboard/intake",
        },
        {
          title: "Results History",
          url: "/dashboard/results",
        },
        {
          title: "Timeline",
          url: "/dashboard/timeline",
        },
      ],
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: FileTextIcon,
    },
    {
      title: "AI Chat",
      url: "/dashboard/chat",
      icon: MessageCircleIcon,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: UserIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],
  quickLinks: [
    {
      name: "Popular Visas",
      url: "/dashboard/visa/DE-BLUE-CARD",
      icon: TrendingUpIcon,
    },
    {
      name: "UK Skilled Worker",
      url: "/dashboard/visa/UK-SKILLED-WORKER",
      icon: GlobeIcon,
    },
    {
      name: "US H-1B",
      url: "/dashboard/visa/US-H1B",
      icon: GlobeIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Update isActive based on current path
  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive:
      item.url === pathname ||
      item.items?.some((subItem) => subItem.url === pathname),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BrandSwitcher brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavQuickLinks links={data.quickLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
