"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Map paths to breadcrumb labels
const pathLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/intake": "New Analysis",
  "/dashboard/results": "Results History",
  "/dashboard/timeline": "Timeline",
  "/dashboard/profile": "Profile",
  "/dashboard/documents": "Documents",
  "/dashboard/chat": "AI Chat",
  "/dashboard/settings": "Settings",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Skip dynamic segments like [id] or [code]
    if (segment.startsWith("[")) return;

    // Get label from map or capitalize segment
    let label = pathLabels[currentPath];
    if (!label) {
      // Handle dynamic routes
      if (segments[index - 1] === "results" && !pathLabels[currentPath]) {
        label = "Analysis Details";
      } else if (segments[index - 1] === "visa" && !pathLabels[currentPath]) {
        label = segment.toUpperCase().replace(/-/g, " ");
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    }

    breadcrumbs.push({ label, href: currentPath, isLast });
  });

  return breadcrumbs;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-5 bg-border/50"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem
                    key={crumb.href}
                    className={index === 0 ? "" : "hidden md:block"}
                  >
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
