export const ROLES = {
  MEMBER: {
    label: "חבר צוות",
    power: 1,
  },
  TEAM_LEADER: {
    label: "ראש צוות",
    power: 2,
  },
  SHIFTS_ADMIN: {
    label: "אחראי משמרות",
    power: 3,
  },
};

export type Role = keyof typeof ROLES;
