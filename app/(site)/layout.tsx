import { SiteHeader } from "@/ui/layout/site-header";
import { SiteFooter } from "@/ui/layout/site-footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh">{children}</main>
      <SiteFooter />
    </>
  );
}
