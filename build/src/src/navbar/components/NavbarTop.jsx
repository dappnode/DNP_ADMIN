import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as selector from "../selectors";
// modules
import chains from "chains";
// Icons
import Link from "Icons/Link";
// Utils
import parseType from "utils/parseType";
// Components
import NavbarTopDropdownMessages from "./NavbarTopDropdownMessages";

class NavbarTopView extends React.Component {
  render() {
    let chainInfo = Object.keys(this.props.chains).map(id => ({
      title: id,
      body: this.props.chains[id].msg,
      type: parseType(this.props.chains[id].status)
    }));

    // ###### This code is to incorporate the bell again

    // <NavbarTopDropdownMessages
    //   name={'Alerts'}
    //   messages={alerts}
    //   icon={Bell}
    // />
    let DAppNodeTag = [];
    if (this.props.name) DAppNodeTag.push(this.props.name);
    if (this.props.ip) DAppNodeTag.push(this.props.ip);

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
          <a href="https://dappnode.io/" className="nav-link">
            Donate
          </a>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  name: selector.getVpnParamsName,
  ip: selector.getVpnParamsIp,
  chains: chains.selectors.getAll
});

const mapDispatchToProps = dispatch => {
  return {};
};

const NavbarTop = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarTopView);

export default NavbarTop;
