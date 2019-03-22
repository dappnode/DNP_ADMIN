import React from "react";
// Components
import SideNav from "./SideNav";
import TopNav from "./TopNav";

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
        <SideNav />
        <div className="content-wrapper dappnode-background">
          <TopNav />
        </div>
      </React.Fragment>
    );
  }
}
