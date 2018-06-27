import React from "react";
import { Route } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";

import PackageManagerInterface from "./components/PackageManagerInterface";
import PackageInterface from "./components/PackageInterface";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import NonAdmin from "./components/NonAdmin";
import AppStore from "stores/AppStore";

// Testing redux
import dashboard from "./dashboard";
import devices from "./devices";
import installer from "./installer";

// Redux

import { ToastContainer } from "react-toastify";

// Init css
import "./include/bootstrap";
import "./sb-admin.css";
import "./admin_UI.css";
// APIs

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
          <div className="wrapper fixed-nav">
            <Navbar />
            <div className="content-wrapper dappnode-background">
              <div className="container-fluid app-content">
                <ErrorBoundary>
                  <Route exact path="/" component={Home} />
                  <Route
                    path={"/" + dashboard.constants.NAME}
                    component={dashboard.component}
                  />
                  <Route
                    path={"/" + devices.constants.NAME}
                    component={devices.components.DevicesInterface}
                  />
                  <Route
                    path={"/" + installer.constants.NAME}
                    component={installer.component}
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
