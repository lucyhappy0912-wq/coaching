import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/dal";
import { uploadMedia } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일을 선택해 주세요." }, { status: 400 });
  }
  try {
    const saved = await uploadMedia(file);
    return NextResponse.json(saved);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "CMS_MEDIA_TYPE") {
      return NextResponse.json({ error: "JPG, PNG, WebP만 올릴 수 있습니다." }, { status: 400 });
    }
    if (code === "CMS_MEDIA_SIZE") {
      return NextResponse.json({ error: "파일은 5MB 이하여야 합니다." }, { status: 400 });
    }
    if (code === "CMS_STORE_READONLY") {
      return NextResponse.json({ error: "저장소가 연결되지 않았습니다." }, { status: 503 });
    }
    return NextResponse.json({ error: "업로드에 실패했습니다." }, { status: 500 });
  }
}
