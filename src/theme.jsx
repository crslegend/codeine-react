import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#437FC7",
    },
    secondary: {
      main: "#164D8F",
    },
    yellow: {
      main: "#f0ae24",
    },
    orange: {
      main: "#E55812",
    },
    cyan: {
      main: "#D7F9FF",
    },
    red: {
      main: "#C74343",
    },
    darkred: {
      main: "#a43030",
    },
    green: {
      main: "#1A8917",
    },
    darkgreen: {
      main: "#136b11",
    },
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: "Roboto mono",
    h1: {
      fontSize: 36,
    },
    h2: {
      fontSize: 32,
    },
    h3: {
      fontSize: 30,
    },
    h4: {
      fontSize: 28,
    },
    h5: {
      fontSize: 22,
    },
    h6: {
      fontSize: 18,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    subtitle1: {
      fontSize: 12,
    },
  },
});

export default theme;
