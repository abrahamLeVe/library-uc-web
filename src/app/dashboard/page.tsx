import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A sidebar with a header and a search form.",
};

export default function Page() {
  const iframeHeight = "800px";

  return (
    <div className="[--header-height:56px]">
      {/* Cambié spacing(14) por un valor fijo de ejemplo */}
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>

              {/* Aquí ya usamos iframeHeight */}
              <div
                style={{ height: iframeHeight }}
                className="bg-muted/50 flex-1 rounded-xl md:min-h-min"
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
