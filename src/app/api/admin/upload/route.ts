import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/dal";
import { IMAGE_MAX_BYTES, VIDEO_MAX_BYTES, formatMegabytes } from "@/lib/cms/media-limits";
import { uploadMedia } from "@/lib/cms/media";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  const expect = form.get("kind") === "video" ? "video" : form.get("kind") === "image" ? "image" : undefined;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일을 선택해 주세요." }, { status: 400 });
  }
  try {
    const saved = await uploadMedia(file, expect);
    return NextResponse.json(saved);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "CMS_MEDIA_TYPE") {
      return NextResponse.json(
        { error: "사진은 JPG, PNG, GIF, WebP, AVIF / 영상은 MP4, MOV, AVI, WMV, WebM 등을 올릴 수 있습니다." },
        { status: 400 },
      );
    }
    if (code === "CMS_MEDIA_SIZE") {
      return NextResponse.json(
        {
          error: `사진은 ${formatMegabytes(IMAGE_MAX_BYTES)}, 영상은 ${formatMegabytes(VIDEO_MAX_BYTES)}까지 올릴 수 있습니다.`,
        },
        { status: 400 },
      );
    }
    if (code === "CMS_STORE_READONLY") {
      return NextResponse.json({ error: "이 환경에서는 파일을 저장할 수 없습니다." }, { status: 503 });
    }
    return NextResponse.json({ error: "업로드에 실패했습니다." }, { status: 500 });
  }
}
