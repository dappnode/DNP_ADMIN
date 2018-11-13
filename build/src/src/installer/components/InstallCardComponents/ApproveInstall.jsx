import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as action from "../../actions";
import * as selector from "../../selectors";
import { createStructuredSelector } from "reselect";
// Components
import SpecialPermissions from "./SpecialPermissions";
import Envs from "./Envs";
import Vols from "./Vols";
import Dependencies from "./Dependencies";
import Details from "./Details";
import { Link } from "react-router-dom";
import packages from "packages";
import parsePorts from "utils/parsePorts";
// style
import "./checkbox.css";

/**
 * Parses envs
 * @param {object} manifest
 * @return {object} {envName: 'envValue'}
 */

function getEnvs(manifest, stateEnv) {
  const envsArray = ((manifest || {}).image || {}).environment || [];
  const defaultEnvs = {};
  for (const row of envsArray) {
    defaultEnvs[row.split("=")[0]] = row.split("=")[1] || "";
  }
  const _stateEnv = Object.assign({}, stateEnv);
  // Verify that the current stateEnv contains only this package's envs
  for (const env of Object.getOwnPropertyNames(_stateEnv)) {
    if (!Object.keys(defaultEnvs).includes(env)) {
      delete _stateEnv[env];
    }
  }
  return {
    ...defaultEnvs,
    ..._stateEnv
  };
}

function getVols(manifest, stateVol, onlyState) {
  const volsArray = ((manifest || {}).image || {}).volumes || [];
  const defaultVols = {};
  for (const row of volsArray) {
    const [hostPath] = row.split(":");
    defaultVols[row] = hostPath;
  }
  const _stateVol = Object.assign({}, stateVol);
  // Verify that the current stateEnv contains only this package's envs
  for (const vol of Object.getOwnPropertyNames(_stateVol)) {
    if (!Object.keys(defaultVols).includes(vol)) {
      delete _stateVol[vol];
    }
  }
  // Do not include default vols
  if (onlyState) {
    return _stateVol;
  } else {
    return {
      ...defaultVols,
      ..._stateVol
    };
  }
}

class ApproveInstallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envs: {},
      vols: {},
      options: {
        BYPASS_CORE_RESTRICTION: false
      }
    };
    this.handleEnvChange = this.handleEnvChange.bind(this);
    this.handleVolChange = this.handleVolChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.approveInstall = this.approveInstall.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
    install: PropTypes.func.isRequired
  };

  handleEnvChange({ value, name }) {
    this.setState({
      envs: {
        ...this.state.envs,
        [name]: value
      }
    });
  }

  handleVolChange({ value, name }) {
    // if (value && value.startsWith("/")) {
    //   this.props.getDiskSpaceAvailable({ path: value });
    // }
    this.setState({
      vols: {
        ...this.state.vols,
        [name]: value
      }
    });
  }

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
    // Get envs
    const envs = getEnvs(this.props.manifest, this.state.envs);
    // Get ports
    const vols = getVols(this.props.manifest, this.state.vols, true);
    // Get ports
    const ports = parsePorts(this.props.manifest);
    // Call install
    // Path ipfs names:
    let id = this.props.id;
    let { name, version } = this.props.manifest;
    if (id.startsWith("/ipfs/")) id = name + "@" + id;
    else id = name + "@" + version;
    // Fire install call
    let options = this.state.options;
    this.props.install({ id, envs, vols, ports, options });
    // Fire call to set dependency envs
    if (this.props.manifest && this.props.manifest.dependencies) {
      for (const depName of Object.keys(this.props.manifest.dependencies)) {
        this.props.updateDefaultEnvs({ id: depName });
      }
    }
  }

  render() {
    const envs = getEnvs(this.props.manifest, this.state.envs);
    const vols = getVols(this.props.manifest, this.state.vols);

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
              <button className="btn dappnode-background-color">
                GO TO PACKAGE
              </button>
            </Link>
          ) : (
            <button
              className="btn dappnode-background-color"
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
        <Dependencies request={this.props.request || {}} />
        <Envs envs={envs} handleEnvChange={this.handleEnvChange} />
        <Vols
          vols={vols}
          handleVolChange={this.handleVolChange}
          diskSpaceAvailable={this.props.diskSpaceAvailable}
        />
        <SpecialPermissions />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  diskSpaceAvailable: selector.diskSpaceAvailable
});

const mapDispatchToProps = dispatch => ({
  install: ({ id, envs, vols, ports, options }) => {
    dispatch(action.install({ id, vols, options }));
    dispatch(action.updateEnv({ id, envs }));
    dispatch(action.openPorts(ports));
  },
  getDiskSpaceAvailable: ({ path }) => {
    dispatch(action.diskSpaceAvailable({ path }));
  },
  updateDefaultEnvs: ({ id }) => {
    dispatch(action.updateDefaultEnvs({ id }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveInstallView);
