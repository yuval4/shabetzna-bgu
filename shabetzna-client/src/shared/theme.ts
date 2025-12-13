import { createTheme } from "@mui/material/styles";
import { grey, red } from "@mui/material/colors";
import RalewayWoff2 from "../assets/fonts/Rubik-VariableFont_wght.ttf";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: [
      "Raleway",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    primary: {
      main: "#2F80ED",
    },
    secondary: {
      main: "#ffa559", //"#FF7400",
    },
    error: {
      main: red.A400,
    },
    grey: {
      "50": "#fffdfd",
      "100": "#fdfdfd",
      "200": "#F7F9FB",
      "300": "#dee5ec",
      "400": "#d5dee8",
      "500": "#DBE5EF",
      "600": "#c9d4e0",
      "700": "#657894",
      "800": "#5a6c85",
      "900": "#4f5f76",
      A100: "#fdfdfd",
      A200: "#F7F9FB",
      A400: "#d5dee8",
      A700: "#657894",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": {
          fontFamily: "Raleway",
          src: `url(${RalewayWoff2}) format('truetype')`,
          fontWeight: "normal",
          fontStyle: "normal",
          fontDisplay: "swap",
        },
        body: {
          direction: "rtl",
          fontFamily: "Raleway",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          fontSize: "1.5rem",
          fontWeight: "bold",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "4px 12px",
          boxShadow: "none",
          transition: "text-shadow .4s, background-color .4s",
          "&:hover": {
            boxShadow: "none",
          },
        },
        text: {
          textDecoration: "underline !important",
          "&:hover": {
            backgroundColor: "transparent",
            textShadow: "0px 0px 2px #00000030",
          },
        },
        startIcon: {
          marginLeft: 8,
          marginRight: -4,
        },
        endIcon: {
          marginRight: 8,
          marginLeft: -4,
        },
      },
      variants: [
        {
          props: { variant: "glow" },
          style: {
            position: "relative",
            zIndex: 0,
            backgroundColor: "white !important",
            border: `2px solid ${grey[600]}`,
            "&:before": {
              content: '""',
              background:
                "linear-gradient(45deg, #ff5c00, #ff9900, #fffb00, #2f80ed, #7a00ff, #7a00ff, #2f80ed, #fffb00, #ff9900, #ff5c00)",
              position: "absolute",
              top: "-2px",
              left: "-2px",
              backgroundSize: "400%",
              zIndex: -1,
              filter: "blur(5px)",
              width: "calc(100% + 2px)",
              height: "calc(100% + 2px)",
              // opacity: 0,
              borderRadius: "inherit",
              animation: "glowing 20s linear infinite",
              transition: "filter 0.3s ease-in-out, opacity 0.3s ease-in-out",
            },
            "&:hover:before": {
              opacity: 1,
            },
            "&:after": {
              zIndex: -1,
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "inherit",
              left: 0,
              top: 0,
              borderRadius: "inherit",
            },
            "@keyframes glowing": {
              "0%": {
                backgroundPosition: "0 0",
              },
              "50%": {
                backgroundPosition: "200% 0",
              },
              "100%": {
                backgroundPosition: "0 0",
              },
            },
          },
        },
      ],
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          maxHeight: 46,
          margin: 0,
          minWidth: 120,
          "& .MuiInputBase-root": {
            maxHeight: 46,
            padding: 4,
            borderRadius: 10,
          },
          "& input": {
            padding: 12,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          minWidth: 120,
          "& .MuiInputBase-root": {
            padding: 4,
          },
        },
        noOptions: {
          fontSize: "0.875rem",
        },
        option: {
          fontSize: "0.875rem",
        },
      },
      defaultProps: {
        autoHighlight: true,
        noOptionsText: "לא נמצאו תוצאות",
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        enterTouchDelay: 0,
        leaveTouchDelay: 10000,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: 8,
          boxShadow: "none",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        paper: {
          borderRadius: 6,
          boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        },
        list: {
          padding: "4px 0",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        scroller: {
          height: 40,
        },
        indicator: {
          backgroundColor: "black",
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: "0 8px",
          maxWidth: 40,
          width: "auto",
          fontSize: "1rem",
          "&.Mui-selected": {
            color: "black",
            fontWeight: "bold",
          },
        },
      },
    },
    MuiTableCell: {
      defaultProps: {
        align: "right",
      },
      styleOverrides: {
        sizeSmall: {
          width: 32,
        },
        root: {
          backgroundColor: "inherit",
          padding: "10px 16px",
        },
      },
      variants: [
        {
          props: { variant: "head" },
          style: {
            fontWeight: "bold",
          },
        },
      ],
    },
  },
});

export default theme;
