import crypto from "crypto";

const PREVIEW_TTL_MS = 60 * 60 * 1000; // 1 hour

function getPreviewSecret(): string {
  return process.env.PREVIEW_SECRET ?? "dev-preview-secret-change-in-production";
}

/** Create a signed preview token for a post slug. */
export function createPreviewToken(slug: string): string {
  const expires = Date.now() + PREVIEW_TTL_MS;
  const payload = `${slug}:${expires}`;
  const sig = crypto
    .createHmac("sha256", getPreviewSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/** Verify preview token; returns slug if valid. */
export function verifyPreviewToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const sig = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const expectedSig = crypto
      .createHmac("sha256", getPreviewSecret())
      .update(payload)
      .digest("hex");

    if (sig !== expectedSig) return null;

    const colonIdx = payload.lastIndexOf(":");
    if (colonIdx === -1) return null;

    const slug = payload.slice(0, colonIdx);
    const expires = Number.parseInt(payload.slice(colonIdx + 1), 10);
    if (!Number.isFinite(expires) || Date.now() > expires) return null;

    return slug;
  } catch {
    return null;
  }
}
