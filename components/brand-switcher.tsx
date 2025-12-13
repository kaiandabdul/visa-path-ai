"use client";

import Link from "next/link";
import { GlobeIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function BrandSwitcher({
  brand,
}: {
  brand: {
    name: string;
    logo: React.ElementType;
    plan: string;
  };
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className={cn(
            "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200",
            isCollapsed && "!p-2"
          )}
        >
          <Link href="/dashboard">
            <div className={cn(
              "flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-200",
              isCollapsed ? "size-10" : "size-10 aspect-square"
            )}>
              <brand.logo className={cn(
                "transition-all duration-200",
                isCollapsed ? "size-5" : "size-5"
              )} />
            </div>
            <div className={cn(
              "grid flex-1 text-left text-sm leading-tight transition-all duration-200",
              isCollapsed && "opacity-0 w-0 overflow-hidden"
            )}>
              <span className="truncate font-semibold tracking-tight font-serif">{brand.name}</span>
              <span className="truncate text-xs text-muted-foreground">{brand.plan}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
