import React from "react";
import { Route } from "react-router-dom";
// Components
import Home from "./components/home/Home";
import NonAdmin from "./components/NonAdmin";
import NonAdminRedirector from "./components/NonAdminRedirector";
import ErrorBoundary from "./components/generic/ErrorBoundary";
import TopBar from "./components/navbar/TopBar";
import SideBar from "./components/navbar/SideBar";
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
  constructor() {
    super();
    this.state = {
      sidenavCollapsed: true,
      width: window.innerWidth,
      breakPointPx: getBreakPointPx()
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.collapseSideNav = this.collapseSideNav.bind(this);
  }

  toggleSideNav() {
    this.setState({ sidenavCollapsed: !this.state.sidenavCollapsed });
  }
  collapseSideNav() {
    this.setState({ sidenavCollapsed: true });
  }

  // Always collapse the navbar when crossing the breakpoint, going from big to small
  onWindowResize() {
    const breakPointPx = getBreakPointPx();
    if (this.state.width > breakPointPx && window.innerWidth <= breakPointPx) {
      this.collapseSideNav();
    }
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  // App is the parent container of any other component.
  // If this re-renders, the whole app will. So DON'T RERENDER APP!
  // Check ONCE what is the status of the VPN, then display the page for nonAdmin
  // Even make the non-admin a route and fore a redirect

  render() {
    return (
      <div className="body">
        {/* SideNav expands on big screens, while content-wrapper moves left */}
        <SideBar
          collapsed={this.state.sidenavCollapsed}
          collapseSideNav={this.collapseSideNav}
        />
        <TopBar toggleSideNav={this.toggleSideNav} />
        <main>
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
          <ToastContainer />
          <NonAdminRedirector />
        </main>
      </div>
    );
  }
}

// Utility
function getBreakPointPx() {
  const breakPointRem = parseFloat(
    getComputedStyle(document.body).getPropertyValue("--sidebar-breakpoint")
  );
  const baseDocumentFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return breakPointRem * baseDocumentFontSize;
}
