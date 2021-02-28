import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#437FC7",
    },
    secondary: {
      main: "#164D8F",
    },
    red: {
      main: "#C74343",
    },
  },
  typography: {
    fontFamily: "Sen",
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
    subtitle1: {
      fontSize: 18,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
  },
});

export default theme;
