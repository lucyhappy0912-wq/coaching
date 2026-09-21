import { getAdminNavCounts } from "@/lib/admin/nav-counts";

import { AdminFrame } from "./AdminFrame";

export async function AdminShell({
  title,
  subtitle,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const counts = await getAdminNavCounts();

  return (
    <AdminFrame title={title} subtitle={subtitle} wide={wide} counts={counts}>
      {children}
    </AdminFrame>
  );
}
