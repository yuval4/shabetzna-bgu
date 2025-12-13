export const SHIFT_TYPE = {
  FULL_DAY: {
    label: "24 שעות",
  },
  DAY: {
    label: "יום",
  },
  NOON: {
    label: "צהריים",
  },
  NIGHT: {
    label: "לילה",
  },
};

export const ALLOCATE_SHIFT_TYPE = {
  FULL_DAY: {
    label: "24 שעות",
  },
  PARTIAL_DAY: {
    label: "חצאי ימים",
  },
  DAY_NOON_NIGHT: {
    label: "בוקר-צהריים-לילה",
  },
};

export type ShiftType = keyof typeof SHIFT_TYPE;
export type AllocateShiftType = keyof typeof ALLOCATE_SHIFT_TYPE;
