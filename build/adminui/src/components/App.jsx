import React from "react";
import { Route } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
import DevicesInterface from "./DevicesInterface";
import PackageInstallerInterface from "./PackageInstallerInterface";
import PackageManagerInterface from "./PackageManagerInterface";
import PackageInterface from "./PackageInterface";
import DashboardInterface from "./DashboardInterface";
import Navbar from "./Navbar";
import Home from "./Home";
import NonAdmin from "./NonAdmin";
import AppStore from "stores/AppStore";

import { ToastContainer } from "react-toastify";

// Init css
import "./include/bootstrap";
import "./sb-admin.css";
import "./admin_UI.css";
import "react-toastify/dist/ReactToastify.css";

// APIs
import "./watchers";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      status: AppStore.getStatus()
    };
    this.updateStatus = this.updateStatus.bind(this);
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  updateStatus() {
    this.setState({
      status: AppStore.getStatus()
    });
  }

  render() {
    if (
      this.state.status &&
      this.state.status.wamp &&
      this.state.status.wamp.connection &&
      this.state.status.wamp.connection.nonAdmin
    ) {
      return <NonAdmin />;
    } else {
      return (
        <Router>
          <div class="wrapper fixed-nav">
            <Navbar />
            <div class="content-wrapper dappnode-background">
              <div class="container-fluid app-content">
                <ErrorBoundary>
                  <Route exact path="/" component={Home} />
                  <Route path="/dashboard" component={DashboardInterface} />
                  <Route path="/devices" component={DevicesInterface} />
                  <Route
                    path="/installer"
                    component={PackageInstallerInterface}
                  />
                  <Route path="/packages" component={PackageManagerInterface} />
                  <Route
                    path="/package/:packageName"
                    component={PackageInterface}
                  />
                </ErrorBoundary>
              </div>
            </div>
            <ToastContainer />
          </div>
        </Router>
      );
    }
  }
}
