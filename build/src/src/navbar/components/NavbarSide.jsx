import React from "react";
import { NavLink } from "react-router-dom";
// Images
import LogoImg from "img/DAppNode-Black.png";
// Icons
import Devices from "Icons/Devices";
import Dashboard from "Icons/Dashboard";
import Folder from "Icons/Folder";
import NewFolder from "Icons/NewFolder";

let navbarItemsInfo = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Dashboard
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Devices
  },
  {
    name: "Installer",
    href: "/installer",
    icon: NewFolder
  },
  {
    name: "Packages",
    href: "/packages",
    icon: Folder
  }
];

export default class NavbarSide extends React.Component {
  render() {
    let navbarItems = navbarItemsInfo.map((item, i) => {
      return (
        <li
          key={i}
          className="nav-item nav-item-bigger"
          data-toggle="tooltip"
          data-placement="right"
          title={item.name}
        >
          <NavLink
            className="nav-link"
            activeStyle={{
              backgroundColor: "#eeeeee"
            }}
            to={item.href}
          >
            <span className="nav-link-text nav-link-icon">
              <item.icon />
            </span>
            <span className="nav-link-text">{item.name}</span>
          </NavLink>
        </li>
      );
    });

    return (
      <ul
        className="navbar-nav navbar-sidenav navbar-sidebar-fix sidenav-shadow navbar-border"
        id="exampleAccordion"
      >
        <li className="nav-item">
          <NavLink className="nav-link sidenav-topbox" to={"/"}>
            <div className="sidenav-topbox-text">ADMIN UI</div>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/"}>
            <div className="logo-image-container nav-link text-center">
              <img src={LogoImg} className="img-fluid" alt="DAppNode logo" />
            </div>
          </NavLink>
        </li>
        {navbarItems}
      </ul>
    );
  }
}
