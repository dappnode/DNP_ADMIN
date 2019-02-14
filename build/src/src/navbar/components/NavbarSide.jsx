import React from "react";
import { NavLink } from "react-router-dom";
import $ from "jquery";
// Images
import LogoWide from "img/dappnode-logo-wide-min.png";
import EfgLogo from "img/logos/efg-logo-only-min.png";
import AragonLogo from "img/logos/aragon-min.png";
import GivethLogo from "img/logos/giveth-min.png";
import EcfLogo from "img/logos/ecf-min.png";

// items
import { navbarItems } from "../constants";

const fundedBy = [
  {
    logo: EfgLogo,
    text: "Ethereum Foundation",
    link:
      "https://blog.ethereum.org/2018/08/17/ethereum-foundation-grants-update-wave-3/"
  },
  {
    logo: AragonLogo,
    text: "Aragon Nest",
    link: "https://blog.aragon.org/aragon-nest-second-round-of-grants/#dappnode"
  },
  {
    logo: GivethLogo,
    text: "Giveth",
    link: "https://beta.giveth.io/campaigns/5b44b198647f33526e67c262"
  },
  {
    logo: EcfLogo,
    text: "Ethereum Community Fund"
  }
];

export default class NavbarSide extends React.Component {
  componentDidMount() {
    $(".navbar-nav>li>a").on("click", function() {
      $(".navbar-collapse").collapse("hide");
      $(".popover").popover("hide");
    });
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  render() {
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
              <h6 style={{ opacity: 0.6 }}>ADMIN UI</h6>
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
              <span className="nav-link-text nav-link-text-sidebar">
                {item.name}
              </span>
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
            <h6 style={{ opacity: 0.3, fontSize: "80%" }}>SUPPORTED BY</h6>
            <div className="row mt-2 mb-2">
              {fundedBy.map((item, i) => (
                <div key={i} className="col" style={{ padding: "0px 9px" }}>
                  <a href={item.link}>
                    <img
                      src={item.logo}
                      className="img-fluid logo-funded-by"
                      alt="logo"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={item.text}
                      data-delay="300"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </li>
      </ul>
    );
  }
}
