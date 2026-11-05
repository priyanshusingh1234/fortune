// Authorized Admin Slack IDs
export const ADMIN_SLACK_IDS: string[] = [
  "U0BTDMCJ6P7",
  "U093BDEP8FJ",
  ...(process.env.NEXT_PUBLIC_ADMIN_SLACK_IDS || process.env.ADMIN_SLACK_IDS || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean),
];

/**
 * Check if a user object or Slack ID is an authorized admin
 */
export function isUserAdmin(userOrSlackId?: any): boolean {
  if (!userOrSlackId) return false;

  let candidate = "";
  if (typeof userOrSlackId === "string") {
    candidate = userOrSlackId;
  } else if (typeof userOrSlackId === "object") {
    candidate =
      userOrSlackId.slack_id ||
      userOrSlackId.id ||
      userOrSlackId.sub ||
      "";
  }

  const normalized = candidate.toString().trim().toUpperCase();
  return ADMIN_SLACK_IDS.includes(normalized);
}

