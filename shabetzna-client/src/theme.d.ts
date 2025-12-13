import "@mui/material/Button"; // Ensure you're importing the module you want to extend

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    glow: true;
  }
}
