export const STATUSES = [
  { id: "Watching", label: "Watching", icon: "\u25b6", color: "#f4e08a" },
  { id: "Completed", label: "Completed", icon: "\u2713", color: "#b2f0c5" },
  { id: "Planned", label: "Planned", icon: "\u25cb", color: "#8ebbf5" },
  { id: "Paused", label: "Paused", icon: "II", color: "#b8b8b8" },
  { id: "Dropped", label: "Dropped", icon: "X", color: "#f47070" }
];

export const STATUS_IDS = STATUSES.map(s => s.id);
export const STATUS_LABELS = STATUSES.map(s => s.label);

export const SCOLOR = STATUSES.reduce((acc, s) => {
  acc[s.id] = s.color;
  acc[s.label] = s.color;
  return acc;
}, {});

export const SICON = STATUSES.reduce((acc, s) => {
  acc[s.id] = s.icon;
  acc[s.label] = s.icon;
  return acc;
}, {});

export function getStatusIcon(statusIdOrLabel) {
  return SICON[statusIdOrLabel] || "\u2022";
}

// Map old statuses to new statuses for backward compatibility
export const MIGRATION_MAP = {
  "Watched": "Completed",
  "Watching": "Watching",
  "Want to Watch": "Planned",
  "Paused": "Paused",
  "Dropped": "Dropped"
};

export function normalizeStatus(oldStatus) {
  if (!oldStatus) return "Planned";
  const mapped = MIGRATION_MAP[oldStatus];
  if (mapped) return mapped;
  // Fallback in case it's already one of the new IDs
  return STATUS_IDS.includes(oldStatus) ? oldStatus : "Planned";
}
