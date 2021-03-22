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
      main: "#E8C547",
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
