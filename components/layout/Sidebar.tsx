"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, APP_NAME } from "@/lib/utils/constants";
import {
  HomeIcon,
  ClipboardListIcon,
  BarChart3Icon,
  MessageCircleIcon,
  FileTextIcon,
  SettingsIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  clipboard: ClipboardListIcon,
  chart: BarChart3Icon,
  message: MessageCircleIcon,
  file: FileTextIcon,
  settings: SettingsIcon,
} as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {DASHBOARD_NAV.map((link) => {
            const Icon = iconMap[link.icon] || HomeIcon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">Guest User</p>
              <p className="truncate text-xs text-muted-foreground">
                Free Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
