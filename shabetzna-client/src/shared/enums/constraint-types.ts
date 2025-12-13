export const CONSTRAINT_TYPES = {
  CANNOT: {
    label: "אי אפשר",
  },
  PREFER_NOT: {
    label: "העדפה שלא",
  },
  PREFER: {
    label: "העדפה",
  },
  MUST: {
    label: "חובה",
  },
};

export type ConstraintType = keyof typeof CONSTRAINT_TYPES;
