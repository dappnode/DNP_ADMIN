import React from "react";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
// Components
import NavbarSide from "./NavbarSide";
import NavbarTop from "./NavbarTop";
// css
import "./sb-admin-navbar.css"; // default
import "./styles.css"; // custom additions
import LogoWide from "img/logo-wide.png";

export default class Navbar extends React.Component {
  render() {
    return (
      <nav
        style={{
          borderWidth: "0px 0px 1px 0px",
          height: "61px"
        }}
        className="navbar navbar-expand-lg navbar-light bg-topnav navbar-border fixed-top"
        id="mainNav"
      >
        {/* Top box, part of the top and sidenavbar (COLLAPSED) */}
        <NavLink
          className="navbar-brand"
          to={"/"}
          style={{
            width: "var(--width)",
            padding: "10px 25px",
            // This relative -1em compensates the top-navbar padding preserving the exact same size image
            // The logo size and position is fixed by: width 200px, padding-sides of 25px, pos-left 0px
            position: "relative",
            left: "-1em"
          }}
        >
          <img src={LogoWide} className="img-fluid" alt="DAppNode logo" />
        </NavLink>

        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarResponsive"
          style={{ backgroundColor: "white" }}
        >
          <ErrorBoundary>
            <NavbarSide />
          </ErrorBoundary>
          <ErrorBoundary>
            <NavbarTop />
          </ErrorBoundary>
        </div>
      </nav>
    );
  }
}
