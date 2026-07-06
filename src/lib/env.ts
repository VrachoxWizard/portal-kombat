/** Whether mock data fallback is allowed (development or explicit flag). */
export function shouldUseMockData(): boolean {
  if (process.env.USE_MOCK_DATA === "true") return true;
  if (process.env.USE_MOCK_DATA === "false") return false;
  return process.env.NODE_ENV === "development";
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://combatportal.hr";
