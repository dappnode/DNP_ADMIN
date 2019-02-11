import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
// Components
import SpecialPermissions from "./SpecialPermissions";
import Envs from "./Envs";
import Vols from "./Vols";
import Ports from "./Ports";
import Dependencies from "./Dependencies";
import Details from "./Details";
import { Link } from "react-router-dom";
import packages from "packages";
// style
import "./checkbox.css";

class ApproveInstallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        BYPASS_CORE_RESTRICTION: false
      }
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.approveInstall = this.approveInstall.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
    install: PropTypes.func.isRequired
  };

  handleOptionChange(e) {
    const { name, checked } = e.target;
    this.setState({
      options: {
        ...this.state.options,
        [name]: checked
      }
    });
  }

  approveInstall() {
    // Call install
    // Path ipfs names:
    let id = this.props.id;
    let { name, version } = this.props.manifest || {};
    if (id.startsWith("/ipfs/")) id = name + "@" + id;
    else id = name + "@" + version;

    // Fire install call
    this.props.install({ id, options: this.state.options });
  }

  render() {
    // Get install tag: INSTALL / UPDATE / INSTALLED
    let tag = this.props.pkg.tag || "INSTALL";

    const installAvailable = this.props.request && !this.props.request.fetching;

    // Filter options according to the current package
    // 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
    const options = [];
    if (
      (this.props.id || "").startsWith("/ipfs/") &&
      ((this.props.manifest || {}).type || "") === "dncore"
    )
      options.push("BYPASS_CORE_RESTRICTION");

    const installButton = (
      <React.Fragment>
        <div className="float-right ml-3">
          {tag === "UPDATED" ? (
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              to={"/" + packages.constants.NAME + "/" + this.props.id}
            >
              <button className="dappnode-btn">GO TO PACKAGE</button>
            </Link>
          ) : (
            <button
              className="dappnode-btn"
              onClick={this.approveInstall}
              disabled={!installAvailable}
            >
              {tag}
            </button>
          )}
        </div>
        <div className="float-right">
          {options.length
            ? options.map((option, i) => (
                <label
                  key={i}
                  className="container"
                  style={{
                    position: "relative",
                    bottom: "9px",
                    marginBottom: "0px"
                  }}
                >
                  {option}
                  <input
                    type="checkbox"
                    name={option}
                    checked={this.state.options[option]}
                    onChange={this.handleOptionChange}
                  />
                  <span className="checkmark" />
                </label>
              ))
            : null}
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Details pkg={this.props.pkg} subComponent={installButton} />
        <Dependencies
          request={this.props.request || {}}
          installedPackages={this.props.installedPackages}
        />

        <SpecialPermissions />

        {this.props.showAdvancedSettings ? (
          <React.Fragment>
            <Envs />
            <Vols />
            <Ports />
          </React.Fragment>
        ) : (
          <button
            className="btn btn-outline-secondary mt-2 mb-5"
            onClick={this.props.setShowAdvancedSettings.bind(this, true)}
          >
            Show advanced settings
          </button>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  installedPackages: selector.getInstalledPackages,
  showAdvancedSettings: selector.getShowAdvancedSettings
});

const mapDispatchToProps = {
  install: action.install,
  setShowAdvancedSettings: action.setShowAdvancedSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveInstallView);
