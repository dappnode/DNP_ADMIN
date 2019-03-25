import React from "react";
// DropdownMenu components
import DappnodeIdentity from "./dropdownMenus/DappnodeIdentity";
import ChainData from "./dropdownMenus/ChainData";
import Notifications from "./dropdownMenus/Notifications";
import Report from "./dropdownMenus/Report";
// Icons
import MenuBurger from "Icons/MenuBurger";
// Styles
import "./topbar.css";
import "./notifications.css";

const TopBar = ({ toggleSideNav }) => (
  <div id="topbar">
    {/* Left justified items */}
    <div className="left">
      <button className="sidenav-toggler" onClick={toggleSideNav}>
        <MenuBurger />
      </button>
    </div>
    {/* Right justified items */}
    <div className="right">
      <DappnodeIdentity />
      <div className="dropdown-menu-separator" />
      <ChainData />
      <Notifications />
      <div className="dropdown-menu-separator" />
      <Report />
    </div>
  </div>
);

export default TopBar;
