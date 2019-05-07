import React from "react";
// DropdownMenu components
import DappnodeIdentity from "./dropdownMenus/DappnodeIdentity";
import ChainData from "./dropdownMenus/ChainData";
import Notifications from "./dropdownMenus/Notifications";
import Report from "./dropdownMenus/Report";
// Components
import { toggleSideNav } from "./SideBar";
// Icons
import MenuBurger from "Icons/MenuBurger";
// Styles
import "./topbar.css";
import "./notifications.css";

const TopBar = () => (
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
      <div className="topnav-icon-separator" />
      <ChainData />
      <Notifications />
      <div className="topnav-icon-separator" />
      <Report />
    </div>
  </div>
);

export default TopBar;
