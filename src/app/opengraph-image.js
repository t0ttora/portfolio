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
          background: "#1688e8",
          color: "#0b1220",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        {/* subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            Oluş Emre Demir
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: "#d5e7fb",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Tasarım Mühendisi // Maker
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 24,
              color: "#eaf3ff",
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            Robotik • IoT • PCB • Görüntü İşleme • Gömülü Sistemler
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
