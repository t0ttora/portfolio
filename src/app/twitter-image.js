import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "edge";

export default function Image() {
  const { width, height } = size;
  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          color: "#e5e7eb",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        {/* subtle border frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "2px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
          }}
        />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            Oluş Emre Demir
          </div>
          <div style={{ marginTop: 14, fontSize: 26, color: "#93c5fd", fontWeight: 600 }}>
            Tasarım Mühendisi // Maker
          </div>
          <div style={{ marginTop: 30, fontSize: 24, color: "#cbd5e1" }}>
            Robotik • IoT • PCB • Görüntü İşleme • Gömülü Sistemler
          </div>
          <div style={{ marginTop: 36, fontSize: 22, color: "#60a5fa" }}>olusemre.dev</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
