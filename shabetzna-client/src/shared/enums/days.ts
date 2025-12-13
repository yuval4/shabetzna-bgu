export const DAYS = {
  sunday: {
    id: "sunday",
    label: "ראשון",
    index: 0,
  },
  monday: {
    id: "monday",
    label: "שני",
    index: 1,
  },
  tuesday: {
    id: "tuesday",
    label: "שלישי",
    index: 2,
  },
  wednesday: {
    id: "wednesday",
    label: "רביעי",
    index: 3,
  },
  thursday: {
    id: "thursday",
    label: "חמישי",
    index: 4,
  },
  friday: {
    id: "friday",
    label: "שישי",
    index: 5,
  },
  saturday: {
    id: "saturday",
    label: "שבת",
    index: 6,
  },
};

export type Days = keyof typeof DAYS;
