import { ImageResponse } from "next/og";

export const alt = "CombatPortal HR članak";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = formatSlugTitle(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #060810 0%, #1a0a0a 100%)",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 22, color: "#ef4444", fontWeight: 800, marginBottom: 16 }}>
          COMBATPORTAL HR
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
