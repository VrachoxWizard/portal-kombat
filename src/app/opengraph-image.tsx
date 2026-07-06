import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CombatPortal HR - Borilačke Vijesti, Analize i Predikcije";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #060810 0%, #1a0a0a 50%, #060810 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ef4444",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 20,
          }}
        >
          CombatPortal HR
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          Borilačke Vijesti, Analize i Predikcije
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 24,
            maxWidth: "800px",
          }}
        >
          MMA • Boks • Kickboks — vodeći hrvatski borilački medij
        </div>
      </div>
    ),
    { ...size }
  );
}
