import React from "react";
// Components
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import ErrorBoundary from "components/generic/ErrorBoundary";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenavCollapsed: false
    };
  }

  render() {
    return (
      <React.Fragment>
        <ErrorBoundary>
          <SideNav />
        </ErrorBoundary>
        <div className="content-wrapper dappnode-background">
          <ErrorBoundary>
            <TopNav />
          </ErrorBoundary>
        </div>
      </React.Fragment>
    );
  }
}
