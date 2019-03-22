import React from "react";
import { NavLink } from "react-router-dom";
import { sidenavItems, fundedBy } from "./navbarItems";
import logo from "img/dappnode-logo-wide-min.png";

const SideBar = ({ collapsed, collapseSideNav }) => (
  <div id="sidebar" className={collapsed ? "collapsed" : ""}>
    <div className="top sidenav-item">
      <img className="sidebar-logo header" src={logo} alt="logo" />
    </div>
    <div className="nav">
      <div className="sidenav-item">
        <div className="subheader">ADMIN UI</div>
      </div>

      {sidenavItems.map(item => (
        <NavLink
          key={item.name}
          className="sidenav-item selectable"
          onClick={collapseSideNav}
          to={item.href}
        >
          <item.icon scale={0.8} />
          <span className="name svg-text">{item.name}</span>
        </NavLink>
      ))}
    </div>

    {/* mt-auto will push the div to the bottom */}
    <div className="funded-by">
      <div className="funded-by-text">SUPPORTED BY</div>
      <div className="funded-by-logos">
        {fundedBy.map((item, i) => (
          <a key={i} href={item.link}>
            <img
              src={item.logo}
              className="img-fluid funded-by-logo"
              alt="logo"
              data-toggle="tooltip"
              data-placement="top"
              title={item.text}
              data-delay="300"
            />
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default SideBar;
