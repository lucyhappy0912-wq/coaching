import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Meomchunja — your transition partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/media/home-moment.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#003a40",
        }}
      >
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 32, 36, 0.55)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 88,
            paddingRight: 88,
            color: "#f5f7f7",
          }}
        >
          <div style={{ display: "flex", gap: 18, marginBottom: 36 }}>
            <div style={{ width: 28, height: 92, background: "#f5f7f7", borderRadius: 6 }} />
            <div style={{ width: 28, height: 92, background: "#f5f7f7", borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 72, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Meomchunja</div>
          <div style={{ marginTop: 18, fontSize: 32, opacity: 0.88 }}>your transition partner</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
