import React from "react";
import { Route } from "react-router-dom";
// Components
import Home from "./components/Home";
import NonAdmin from "./components/NonAdmin";
import NonAdminRedirector from "./components/NonAdminRedirector";
import ErrorBoundary from "./components/ErrorBoundary";
// Modules
import dashboard from "./dashboard";
import activity from "./activity";
import devices from "./devices";
import installer from "./installer";
import packages from "./packages";
import system from "./system";
import navbar from "./navbar";
import troubleshoot from "./troubleshoot";
import sdk from "./sdk";
// Redux
import { ToastContainer } from "react-toastify";

const modules = [
  dashboard,
  devices,
  installer,
  packages,
  system,
  activity,
  troubleshoot,
  sdk
];

export default class App extends React.Component {
  // App is the parent container of any other component.
  // If this re-renders, the whole app will. So DON'T RERENDER APP!
  // Check ONCE what is the status of the VPN, then display the page for nonAdmin
  // Even make the non-admin a route and fore a redirect

  render() {
    return (
      <div className="wrapper fixed-nav">
        <navbar.component />
        <div className="content-wrapper dappnode-background">
          <div className="container-fluid app-content">
            <ErrorBoundary>
              {/* Home, exact path home */}
              <Route exact path="/" component={Home} />
              {/* Create a route for each module */}
              {modules.map(_module => {
                const RootComponent = _module.component;
                const id = _module.constants.NAME;
                return (
                  <Route key={id} path={`/${id}`} component={RootComponent} />
                );
              })}
              {/* Dedicated routes for non-module components */}
              <Route path={"/nonadmin"} component={NonAdmin} />
            </ErrorBoundary>
          </div>
        </div>
        <ToastContainer />
        <NonAdminRedirector />
      </div>
    );
  }
}
