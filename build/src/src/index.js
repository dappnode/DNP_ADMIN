import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
// ##### Investigate if HashRouter is really required
import { HashRouter as Router } from "react-router-dom";

import store from "./store";
import App from "./App";
import api from "./API";
import { cleanObj } from "utils/objects";

// Init css
import "react-toastify/dist/ReactToastify.css";
// Boostrap loaders
import * as $ from "jquery";
import Tether from "tether";
import Popper from "popper.js";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./layout.css";
import "./dappnode_styles.css";
import "./dappnode_colors.css";

// Initialize boostrap dependencies
window.jQuery = window.$ = $;
window.Tether = Tether;
window.Popper = Popper;

// Start the autobahn instance
api.start();

// This process.env. vars will be substituted at build time
// The REACT_APP_ prefix is mandatory for the substitution to work
window.versionData = cleanObj({
  version: process.env.REACT_APP_VERSION,
  branch: process.env.REACT_APP_BRANCH,
  commit: process.env.REACT_APP_COMMIT
});

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
