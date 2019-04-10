import React from "react";
import { NavLink } from "react-router-dom";
import { sidenavItems, fundedBy } from "./navbarItems";
import logo from "img/dappnode-logo-wide-min.png";
import "./sidebar.css";

if (!Array.isArray(sidenavItems)) throw Error("sidenavItems must be an array");
if (!Array.isArray(fundedBy)) throw Error("fundedBy must be an array");

// The sidebar is kept exclusively in this component state
// In order to avoid the App or redux to be aware of the
// sidebar state while allowing the tobar to toggle the sidebar
// Both components will communicate through window events
const toggleSideNavEvent = "toggleSideNavEvent";
export function toggleSideNav() {
  window.dispatchEvent(new Event(toggleSideNavEvent));
}

export default class SideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      sidenavCollapsed: true,
      width: window.innerWidth,
      breakPointPx: getBreakPointPx()
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.collapseSideNav = this.collapseSideNav.bind(this);
  }

  componentDidMount() {
    window.addEventListener(toggleSideNavEvent, this.toggleSideNav);
    window.addEventListener("resize", this.onWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener(toggleSideNavEvent, this.toggleSideNav);
    window.removeEventListener("resize", this.onWindowResize);
  }

  toggleSideNav() {
    this.setState({ sidenavCollapsed: !this.state.sidenavCollapsed });
  }
  collapseSideNav() {
    this.setState({ sidenavCollapsed: true });
  }

  // Always collapse the navbar when crossing the breakpoint, going from big to small
  onWindowResize() {
    const breakPointPx = getBreakPointPx();
    if (this.state.width > breakPointPx && window.innerWidth <= breakPointPx) {
      this.collapseSideNav();
    }
    this.setState({ width: window.innerWidth });
  }

  render() {
    const collapsed = this.state.sidenavCollapsed;
    const collapseSideNav = this.collapseSideNav;
    return (
      <div id="sidebar" className={collapsed ? "collapsed" : ""}>
        <NavLink className="top sidenav-item" to={"/"}>
          <img className="sidebar-logo header" src={logo} alt="logo" />
        </NavLink>

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
  }
}

// Utility

function getBreakPointPx() {
  const breakPointRem = parseFloat(
    getComputedStyle(document.body).getPropertyValue("--sidebar-breakpoint")
  );
  const baseDocumentFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return breakPointRem * baseDocumentFontSize;
}
