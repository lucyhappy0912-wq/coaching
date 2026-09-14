import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/dal";
import { IMAGE_MAX_BYTES, VIDEO_MAX_BYTES, formatMegabytes } from "@/lib/cms/media-limits";
import { uploadMedia } from "@/lib/cms/media";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return jsonError("로그인이 만료되었습니다. 다시 로그인해 주세요.", 401);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonError("파일을 받지 못했습니다. 용량을 줄이거나 다시 올려 주세요.", 400);
    }

    const file = form.get("file");
    const expect = form.get("kind") === "video" ? "video" : form.get("kind") === "image" ? "image" : undefined;
    if (!(file instanceof File)) {
      return jsonError("파일을 선택해 주세요.", 400);
    }

    const saved = await uploadMedia(file, expect);
    return NextResponse.json(saved);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "CMS_MEDIA_TYPE") {
      return jsonError(
        "사진은 JPG, PNG, GIF, WebP, AVIF / 영상은 MP4, MOV, AVI, WMV, WebM 등을 올릴 수 있습니다.",
        400,
      );
    }
    if (code === "CMS_MEDIA_HEIC") {
      return jsonError("iPhone HEIC는 올릴 수 없습니다. JPG 또는 PNG로 바꿔 주세요.", 400);
    }
    if (code === "CMS_MEDIA_SIZE") {
      return jsonError(
        `사진은 ${formatMegabytes(IMAGE_MAX_BYTES)}, 영상은 ${formatMegabytes(VIDEO_MAX_BYTES)}까지 올릴 수 있습니다.`,
        400,
      );
    }
    if (code === "CMS_MEDIA_TRUNCATED") {
      return jsonError("파일이 잘려서 도착했습니다. 다시 올려 주세요.", 400);
    }
    if (code === "CMS_MEDIA_WRITE") {
      return jsonError("이 컴퓨터에 사진을 저장하지 못했습니다. 폴더 권한을 확인해 주세요.", 500);
    }
    if (code === "CMS_STORE_READONLY") {
      return jsonError("이 환경에서는 파일을 저장할 수 없습니다.", 503);
    }
    return jsonError("업로드에 실패했습니다. 잠시 후 다시 올려 주세요.", 500);
  }
}
