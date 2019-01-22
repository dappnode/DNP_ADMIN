import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as selector from "../selectors";
import { viewedNotifications } from "../actions";
import $ from "jquery";
// Icons
import Link from "Icons/Link";
import Bell from "Icons/Bell";
// Modules
import troubleshoot from "troubleshoot";
// Components
import NavbarTopDropdownMessages from "./NavbarTopDropdownMessages";

class NavbarTopView extends React.Component {
  componentDidMount() {
    $(() => {
      $('[data-toggle="popover"]').popover();
    });
  }

  render() {
    const chainInfo = this.props.chainData.map((chain = {}) => ({
      title: chain.name,
      body: chain.message,
      type: chain.error ? "danger" : chain.syncing ? "warning" : "success",
      progress: chain.progress
    }));

    let notificationsInfo = this.props.notifications;
    if (!notificationsInfo.length)
      notificationsInfo = [{ body: "No notifications yet" }];

    const dnIdn = this.props.dappnodeIdentity;

    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item nav-item-infoText">
          <span
            data-container="body"
            data-toggle="popover"
            data-placement="bottom"
            data-content={Object.keys(dnIdn)
              .map(key => `<strong>${key}:</strong> ${dnIdn[key]}`)
              .join("<br/>")}
            data-html="true"
            style={{
              textTransform: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "block"
            }}
          >
            {dnIdn.name}
          </span>
        </li>
        <NavbarTopDropdownMessages
          name={"Chain status"}
          messages={chainInfo}
          icon={Link}
        />
        <NavbarTopDropdownMessages
          name={"Notifications"}
          messages={notificationsInfo}
          icon={Bell}
          onClick={this.props.viewedNotifications}
        />
        <li className="nav-item nav-item-infoText">
          <a href="https://dappnode.io/" className="nav-link">
            Donate
          </a>
        </li>
        <li className="nav-item nav-item-infoText">
          <NavLink className="nav-link" to={"/" + troubleshoot.constants.NAME}>
            Report
          </NavLink>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  dappnodeIdentity: selector.getDappnodeIdentity,
  chainData: selector.chainData,
  notifications: selector.getNotifications
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { viewedNotifications };

const NavbarTop = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarTopView);

export default NavbarTop;
