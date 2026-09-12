import "server-only";

import { randomUUID } from "node:crypto";
import { cache } from "react";

import { cmsEnabled, cmsRest, cmsWritable } from "./client";
import { readLocalContent, writeLocalContent } from "./local";
import { mergePages } from "./merge-pages";
import { cmsSeed } from "./seed";
import type { CmsData, CmsMember, CmsPost } from "./types";

function mergeCms(raw: Partial<CmsData> | null | undefined): CmsData {
  const seed = cmsSeed();
  if (!raw) return seed;
  return {
    site: { ...seed.site, ...raw.site },
    topMessages: raw.topMessages?.length ? raw.topMessages : seed.topMessages,
    hero: raw.hero?.length ? raw.hero : seed.hero,
    coach: {
      ...seed.coach,
      ...raw.coach,
      credentials: raw.coach?.credentials?.length ? raw.coach.credentials : seed.coach.credentials,
    },
    faqs: raw.faqs?.length ? raw.faqs : seed.faqs,
    pages: mergePages(raw.pages, seed.pages),
  };
}

export const getContent = cache(async (): Promise<CmsData> => {
  if (cmsEnabled()) {
    try {
      const rows = await cmsRest<{ data: CmsData }[]>("cms_content?id=eq.site&select=data");
      return mergeCms(rows[0]?.data);
    } catch {
      return cmsSeed();
    }
  }
  return mergeCms(await readLocalContent());
});

export async function patchContent(patch: Partial<CmsData>) {
  const current = await getContent();
  return saveContent({
    site: patch.site ?? current.site,
    topMessages: patch.topMessages ?? current.topMessages,
    hero: patch.hero ?? current.hero,
    coach: patch.coach ?? current.coach,
    faqs: patch.faqs ?? current.faqs,
    pages: patch.pages ?? current.pages,
  });
}

export async function saveContent(data: CmsData) {
  if (!cmsWritable()) throw new Error("CMS_STORE_READONLY");
  const next = mergeCms(data);
  if (!cmsEnabled()) {
    await writeLocalContent(next);
    return next;
  }
  await cmsRest("cms_content", {
    method: "POST",
    headers: { Prefer: "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify({
      id: "site",
      data: next,
      revision: 1,
      updated_at: new Date().toISOString(),
    }),
  });
  return next;
}

type PostRow = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

function toPost(row: PostRow): CmsPost {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPosts(publishedOnly = false): Promise<CmsPost[]> {
  if (!cmsEnabled()) return [];
  const filter = publishedOnly ? "&published=eq.true" : "";
  const rows = await cmsRest<PostRow[]>(
    `cms_posts?select=*&order=created_at.desc${filter}`,
  );
  return rows.map(toPost);
}

export async function getPost(id: string, publishedOnly = false): Promise<CmsPost | null> {
  if (!cmsEnabled() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const extra = publishedOnly ? "&published=eq.true" : "";
  const rows = await cmsRest<PostRow[]>(`cms_posts?id=eq.${id}&select=*${extra}`);
  return rows[0] ? toPost(rows[0]) : null;
}

export async function savePost(input: { id?: string; title: string; body: string; published: boolean }) {
  if (!cmsEnabled()) throw new Error("CMS_STORE_READONLY");
  const now = new Date().toISOString();
  const id = input.id && /^[0-9a-f-]{36}$/i.test(input.id) ? input.id : randomUUID();
  const existing = input.id ? await getPost(id) : null;
  await cmsRest("cms_posts", {
    method: "POST",
    body: JSON.stringify({
      id,
      title: input.title.trim(),
      body: input.body.trim(),
      published: input.published,
      created_at: existing?.createdAt ?? now,
      updated_at: now,
    }),
  });
  return id;
}

export async function removePost(id: string) {
  if (!cmsEnabled() || !/^[0-9a-f-]{36}$/i.test(id)) return false;
  const deleted = await cmsRest<{ id: string }[]>(`cms_posts?id=eq.${id}`, { method: "DELETE" });
  return Array.isArray(deleted) && deleted.length > 0;
}

type MemberRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  source: string;
  created_at: string;
};

export async function listMembers(): Promise<CmsMember[]> {
  if (!cmsEnabled()) return [];
  const rows = await cmsRest<MemberRow[]>("cms_members?select=*&order=created_at.desc");
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    note: row.note,
    source: row.source,
    createdAt: row.created_at,
  }));
}

export async function addMember(input: { name: string; phone: string; email: string; note: string }) {
  if (!cmsEnabled()) throw new Error("CMS_STORE_READONLY");
  await cmsRest("cms_members", {
    method: "POST",
    body: JSON.stringify({
      id: randomUUID(),
      name: input.name.trim(),
      phone: input.phone.replace(/\D/g, ""),
      email: input.email.trim().toLowerCase(),
      note: input.note.trim(),
      source: "manual",
      created_at: new Date().toISOString(),
    }),
  });
}

export async function removeMember(id: string) {
  if (!cmsEnabled() || !/^[0-9a-f-]{36}$/i.test(id)) return false;
  const deleted = await cmsRest<{ id: string }[]>(`cms_members?id=eq.${id}`, { method: "DELETE" });
  return Array.isArray(deleted) && deleted.length > 0;
}
