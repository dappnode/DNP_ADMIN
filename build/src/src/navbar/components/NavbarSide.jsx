import React from "react";
import { NavLink } from "react-router-dom";
import $ from "jquery";
// Images
import LogoWide from "img/logo-wide.png";
import AragonLogo from "img/aragon.png";
import EcfLogo from "img/ecf.png";
import EfgLogo from "img/efg-logo-only.png";

// items
import { navbarItems } from "../constants";

export default class NavbarSide extends React.Component {
  componentDidMount() {
    $(".navbar-nav>li>a").on("click", function() {
      $(".navbar-collapse").collapse("hide");
    });
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  render() {
    const fundedBy = [
      { logo: EfgLogo, text: "Ethereum Foundation" },
      { logo: AragonLogo, text: "Aragon Nest" },
      { logo: EcfLogo, text: "Ethereum Community Fund" }
    ];
    return (
      <ul
        style={{ borderWidth: "0px 1px 0px 0px" }}
        className="navbar-nav navbar-sidenav navbar-sidebar-fix sidenav-shadow navbar-border"
        id="exampleAccordion"
      >
        {/* Top box, part of the top and sidenavbar (EXPANDED) */}
        <li className="nav-item" id="NavbarHeader">
          <NavLink
            className="nav-link sidenav-topbox"
            style={{ padding: "10px 25px", height: "61px" }}
            to={"/"}
          >
            <img src={LogoWide} className="img-fluid" alt="DAppNode logo" />
          </NavLink>
        </li>

        {/* Top text, not part of navbar item */}
        <li className="nav-item" id="NavbarLogo">
          <NavLink className="nav-link" to={"/"}>
            <div className="nav-link" style={{ padding: "10px 17px 0px" }}>
              <h7 style={{ opacity: 0.6 }}>ADMIN UI</h7>
            </div>
          </NavLink>
        </li>

        {/* Navbar items, routes to each component of the app */}
        {navbarItems.map((item, i) => (
          <li key={i} className="nav-item">
            <NavLink
              className="nav-link"
              activeStyle={{
                backgroundColor: "#f4f7f6",
                borderLeft: "4px solid #3ae0d4"
              }}
              style={{
                padding: "8px 28px",
                borderLeft: "4px solid white",
                backgroundColor: "white",
                transition: "background-color 0.3s ease, border-color 0.3s ease"
              }}
              to={item.href}
            >
              <span className="nav-link-text nav-link-icon">
                <item.icon />
              </span>
              <span className="nav-link-text">{item.name}</span>
            </NavLink>
          </li>
        ))}

        {/* Extra info */}
        <li
          className="nav-item"
          id="NavbarLogo"
          style={{ position: "absolute", bottom: "10px" }}
        >
          <div
            className="nav-text text-center"
            style={{ padding: "10px 17px 0px" }}
          >
            <h7 style={{ opacity: 0.3, fontSize: "80%" }}>FUNDED BY</h7>
            <div className="row mt-2 mb-2">
              {fundedBy.map(item => (
                <div className="col">
                  <img
                    src={item.logo}
                    className="img-fluid logo-funded-by"
                    alt="logo"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item.text}
                    data-delay="300"
                  />
                </div>
              ))}
            </div>
          </div>
        </li>
      </ul>
    );
  }
}
