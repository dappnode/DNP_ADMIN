import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

// Init css
import "react-toastify/dist/ReactToastify.css";
import "./include/bootstrap";
import "./sb-admin.css";
import "./admin_UI.css";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
