import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CmsData } from "./types";

const FILE = path.join(process.cwd(), "data", "content.json");

export async function readLocalContent(): Promise<CmsData | null> {
  try {
    const raw = await readFile(FILE, "utf8");
    return JSON.parse(raw) as CmsData;
  } catch {
    return null;
  }
}

export async function writeLocalContent(data: CmsData) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
