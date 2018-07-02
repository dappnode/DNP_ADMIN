import React from "react";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
// Components
import NavbarSide from "./NavbarSide";
import NavbarTop from "./NavbarTop";

export default class Navbar extends React.Component {
  render() {
    return (
      <nav
        className="navbar navbar-expand-lg navbar-light bg-topnav navbar-border fixed-top"
        id="mainNav"
      >
        <NavLink className="navbar-brand" to={"/"}>
          ADMIN UI
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

        <div className="collapse navbar-collapse" id="navbarResponsive">
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
