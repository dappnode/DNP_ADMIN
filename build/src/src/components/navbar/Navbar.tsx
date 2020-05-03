import React from "react";
// Components
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import ErrorBoundary from "components/ErrorBoundary";

export default function Navbar() {
  return (
    <React.Fragment>
      <ErrorBoundary>
        <SideBar />
      </ErrorBoundary>
      <div className="content-wrapper dappnode-background">
        <ErrorBoundary>
          <TopBar />
        </ErrorBoundary>
      </div>
    </React.Fragment>
  );
}
