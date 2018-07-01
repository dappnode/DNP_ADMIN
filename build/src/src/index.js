import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
// Not needed, history.js specifies the use of Hash.
// import { HashRouter as Router } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import history from "./history";
import store from "./store";
import App from "./App";

// Init css
import "react-toastify/dist/ReactToastify.css";
import "./include/bootstrap";
import "./sb-admin.css";
import "./admin_UI.css";

// Create an enhanced history that syncs navigation events with the store

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
