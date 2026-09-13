import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#003a40",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 28,
            height: 92,
            background: "#f5f7f7",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            width: 28,
            height: 92,
            background: "#f5f7f7",
            borderRadius: 6,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
