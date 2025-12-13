import { green, grey, red, yellow } from "@mui/material/colors";

export const CONSTRAINT_STATUS = {
  APPROVED: {
    label: "אושר",
    color: green[600],
  },
  REJECTED: {
    label: "נדחה",
    color: red[600],
  },
  PENDING: {
    label: "ממתין לאישור",
    color: grey[600],
  },
  CANCELED: {
    label: "בוטל",
    color: yellow[600],
  },
};

export type ConstraintStatus = keyof typeof CONSTRAINT_STATUS;
