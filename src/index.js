import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import theme from "../src/theme";

import { Provider } from "react-redux";
import store from "./redux/Store";

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
};

// adding this hot module allows changes to be seen immediately on the local
// host without the page having to be refreshed entirely for changes to be seen
if (module.hot) {
  module.hot.accept("./App", () => {
    setTimeout(render);
  });
}

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
