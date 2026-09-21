import "server-only";

import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";

import type { AdminCounts } from "@/app/admin/_components/counts";
import { requireAdmin } from "@/lib/auth/dal";
import { listQuestionsJsonl } from "@/lib/board/store-jsonl";
import { dataStoreMode } from "@/lib/check/store-mode";
import { isLiftLead } from "@/lib/leads/kind";
import { listLeadsJsonl } from "@/lib/leads/store-jsonl";
import { dataRest } from "@/lib/supabase/rest";

export const ADMIN_NAV_TAG = "admin-nav";

export function revalidateAdminNav() {
  revalidateTag(ADMIN_NAV_TAG, "max");
}

async function fetchAdminNavCounts(): Promise<AdminCounts> {
  if (dataStoreMode() === "readonly") {
    return { newLeads: 0, liftNew: 0, unanswered: 0 };
  }

  if (dataStoreMode() === "supabase") {
    const now = new Date().toISOString();
    const [newLeads, unanswered] = await Promise.all([
      dataRest<{ preferred_time: string; message: string }[]>(
        `leads?status=eq.new&purge_at=gt.${encodeURIComponent(now)}&select=preferred_time,message`,
      ),
      dataRest<{ answer: string | null }[]>("board_questions?select=answer"),
    ]);
    return {
      newLeads: newLeads.length,
      liftNew: newLeads.filter((row) =>
        isLiftLead({ preferredTime: row.preferred_time, message: row.message }),
      ).length,
      unanswered: unanswered.filter((row) => !row.answer).length,
    };
  }

  const [leads, questions] = await Promise.all([listLeadsJsonl(), listQuestionsJsonl()]);
  return {
    newLeads: leads.filter((row) => row.status === "new").length,
    liftNew: leads.filter((row) => row.status === "new" && isLiftLead(row)).length,
    unanswered: questions.filter((row) => !row.answer).length,
  };
}

const getAdminNavCountsCached = unstable_cache(fetchAdminNavCounts, ["admin-nav-counts-v1"], {
  tags: [ADMIN_NAV_TAG],
  revalidate: 30,
});

export const getAdminNavCounts = cache(async (): Promise<AdminCounts> => {
  await requireAdmin();
  try {
    return await getAdminNavCountsCached();
  } catch {
    return { newLeads: 0, liftNew: 0, unanswered: 0 };
  }
});
