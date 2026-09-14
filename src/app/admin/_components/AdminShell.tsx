import { listQuestionsForAdmin } from "@/lib/board/store";
import { isLiftLead } from "@/lib/leads/kind";
import { listLeadsForAdmin } from "@/lib/leads/store";

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
  const [leads, questions] = await Promise.all([listLeadsForAdmin(), listQuestionsForAdmin()]);
  const counts = {
    newLeads: leads.filter((row) => row.status === "new").length,
    liftNew: leads.filter((row) => row.status === "new" && isLiftLead(row)).length,
    unanswered: questions.filter((row) => !row.answer).length,
  };

  return (
    <AdminFrame title={title} subtitle={subtitle} wide={wide} counts={counts}>
      {children}
    </AdminFrame>
  );
}
