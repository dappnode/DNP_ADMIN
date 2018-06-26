import React from "react";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
import AppStore from "stores/AppStore";

import LogoImg from "img/DAppNode-Black.png";
// Icons
import Devices from "./Icons/Devices";
import Dashboard from "./Icons/Dashboard";
import Folder from "./Icons/Folder";
import NewFolder from "./Icons/NewFolder";
import Circle from "./Icons/Circle";
// import Bell from './Icons/Bell'
import Link from "./Icons/Link";

// FontAwesome.FaTachometerAlt
// FontAwesome.FaMobileAlt
// FontAwesome.FaPlusSquare
// FontAwesome.FaBox
// FontAwesome.FaChartLine

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

class DropdownIcon extends React.Component {
  render() {
    return (
      <a
        className="nav-link dropdown-toggle mr-lg-2"
        id={this.props.name + "Dropdown"}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <this.props.icon />
        <span className="d-lg-none">
          {this.props.name}
          <span className={"badge badge-pill badge-" + this.props.type}>·</span>
        </span>
        <span className={"indicator d-none d-lg-block text-" + this.props.type}>
          <Circle scale={1.3} />
        </span>
      </a>
    );
  }
}
// name={'messages'}

// let alerts = [
//   {
//     title: 'Package Error',
//     rightText: '11:21 AM',
//     body: 'otpweb.dnp.dappnode.eth has exited',
//     type: 'danger'
//   },
//   {
//     title: 'Disk space almost full',
//     rightText: '13:45 AM',
//     body: 'With no diskspace, DAppnode will crash',
//     type: 'warning'
//   }
// ]

class NavbarTopDropdownMessages extends React.Component {
  render() {
    let globalType = "success";
    let messageTypes = this.props.messages.map(message => message.type || "");
    if (messageTypes.includes("danger")) globalType = "danger";
    else if (messageTypes.includes("warning")) globalType = "warning";

    let listItems = this.props.messages.map((message, i) => {
      let type = message.type || "default";
      let rightText = message.rightText || "";
      return (
        <div key={i}>
          <div className="dropdown-divider" />
          <a className="dropdown-item">
            <span className={"text-" + type}>
              <strong>{message.title}</strong>
            </span>
            <span className="small float-right text-muted">{rightText}</span>
            <div className="dropdown-message small">{message.body}</div>
          </a>
        </div>
      );
    });
    return (
      <li className="nav-item dropdown">
        <DropdownIcon
          type={globalType}
          name={this.props.name}
          icon={this.props.icon}
        />
        <div className="dropdown-menu" aria-labelledby="messagesDropdown">
          <h6 className="dropdown-header">{this.props.name}:</h6>
          {listItems}
        </div>
      </li>
    );
  }
}

class NavbarTop extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus(),
      params: AppStore.getParams()
    };
    this.updateChainStatus = this.updateChainStatus.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
    AppStore.on(AppStore.tag.CHANGE, this.updateParams);
  }
  componentWillUnmount() {
    AppStore.removeListener(
      AppStore.tag.CHANGE_CHAINSTATUS,
      this.updateChainStatus
    );
    AppStore.removeListener(AppStore.tag.CHANGE, this.updateParams);
  }
  updateChainStatus() {
    this.setState({
      chainStatus: AppStore.getChainStatus()
    });
  }
  updateParams() {
    this.setState({
      params: AppStore.getParams()
    });
  }

  render() {
    let chainInfo = [
      {
        title: "Mainnet",
        body: this.state.chainStatus.status,
        type: this.state.chainStatus.type
      }
    ];

    // ###### This code is to incorporate the bell again

    // <NavbarTopDropdownMessages
    //   name={'Alerts'}
    //   messages={alerts}
    //   icon={Bell}
    // />
    let DAppNodeTag = [];
    if (this.state.params.NAME) DAppNodeTag.push(this.state.params.NAME);
    if (this.state.params.IP) DAppNodeTag.push(this.state.params.IP);

    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item nav-item-infoText">
          <span
            className="nav-link"
            style={{ textTransform: "none", cursor: "auto" }}
          >
            {DAppNodeTag.join("/")}
          </span>
        </li>
        <NavbarTopDropdownMessages
          name={"ChainStatus"}
          messages={chainInfo}
          icon={Link}
        />
        <li className="nav-item nav-item-infoText">
          <a href="https://dappnode.io/" className="nav-link">
            About
          </a>
        </li>
        <li className="nav-item nav-item-infoText">
          <a href="https://leaderboard.dappnode.io/" className="nav-link">
            Donate
          </a>
        </li>
      </ul>
    );
  }
}

class NavbarSide extends React.Component {
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
