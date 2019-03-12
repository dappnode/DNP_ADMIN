import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
// Not needed, history.js specifies the use of Hash.
// import { HashRouter as Router } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import history from "./history";
import store from "./store";
import App from "./App";
import { initApi } from "API/socketSetup";
import cleanObj from "utils/cleanObj";

// Init css
import "react-toastify/dist/ReactToastify.css";
// Boostrap loaders
import * as $ from "jquery";
import Tether from "tether";
import Popper from "popper.js";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./sb-admin.css";
import "./admin_UI.css";
import "./dappnode_colors.css";

// Initialize boostrap dependencies
window.jQuery = window.$ = $;
window.Tether = Tether;
window.Popper = Popper;

// Start the autobahn instance
initApi();

// This process.env. vars will be substituted at build time
// The REACT_APP_ prefix is mandatory for the substitution to work
window.versionData = cleanObj({
  version: process.env.REACT_APP_VERSION,
  branch: process.env.REACT_APP_BRANCH,
  commit: process.env.REACT_APP_COMMIT
});

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
