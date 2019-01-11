import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import * as utils from "../../utils";
// Components
import SpecialPermissions from "./SpecialPermissions";
import Envs from "./Envs";
import Vols from "./Vols";
import Ports from "./Ports";
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

class ApproveInstallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envs: {},
      userSetVols: {},
      userSetPorts: {},
      options: {
        BYPASS_CORE_RESTRICTION: false
      }
    };
    this.handleEnvChange = this.handleEnvChange.bind(this);
    this.handleVolChange = this.handleVolChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
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

  handleVolChange({ newVol, vol }) {
    this.setState({
      userSetVols: {
        ...this.state.userSetVols,
        [vol]: newVol
      }
    });
  }

  handlePortChange({ newPort, port }) {
    this.setState({
      userSetPorts: {
        ...this.state.userSetPorts,
        [port]: newPort
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
    const manifest = this.props.manifest || {};
    // Get envs
    const envs = getEnvs(manifest, this.state.envs);

    // Merge ports and parse them
    const portsArray = ((manifest.image || {}).ports || []).map(
      port => this.state.userSetPorts[port] || port
    );
    // IN: ['32323:30303/udp', '30304'], OUT: [{number:'32323', type:'UDP'}]
    const ports = parsePorts(portsArray);

    // Call install
    // Path ipfs names:
    let id = this.props.id;
    let { name, version } = manifest;
    if (id.startsWith("/ipfs/")) id = name + "@" + id;
    else id = name + "@" + version;

    // ##### The by package notation is a forward compatibility
    // ##### to suppport setting dependencies' port / vol
    //  userSetVols = {
    //    "kovan.dnp.dappnode.eth": {
    //      "old_path:/root/.local": "new_path:/root/.local"
    //    }, ... }
    //  userSetPorts = {
    //    "kovan.dnp.dappnode.eth": {
    //      "30303": "31313:30303",
    //      "30303/udp": "31313:30303/udp"
    //    }, ... }
    const userSetVols = {
      [name]: this.state.userSetVols
    };
    const userSetPorts = {
      [name]: this.state.userSetPorts
    };

    // Fire install call
    const isCORE = manifest.type === "dncore";
    const options = this.state.options;
    this.props.install({
      id,
      envs,
      isCORE,
      userSetVols,
      userSetPorts,
      ports,
      options
    });
    // Fire call to set dependency envs
    if (manifest && manifest.dependencies) {
      for (const depName of Object.keys(manifest.dependencies)) {
        const depVersion = manifest.dependencies[depName];
        if (utils.isIpfsHash(depVersion)) {
          this.props.updateDefaultEnvs({ id: depVersion });
        } else {
          this.props.updateDefaultEnvs({ id: depName });
        }
      }
    }
  }

  render() {
    const manifest = this.props.manifest || {};
    const envs = getEnvs(manifest, this.state.envs);
    const manifestVols = (manifest.image || {}).volumes || [];
    const manifestPorts = (manifest.image || {}).ports || [];

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
        <Envs envs={envs} handleEnvChange={this.handleEnvChange} />
        <Vols
          manifestVols={manifestVols}
          userSetVols={this.state.userSetVols}
          handleVolChange={this.handleVolChange}
          diskSpaceAvailable={this.props.diskSpaceAvailable}
        />
        <Ports
          manifestPorts={manifestPorts}
          userSetPorts={this.state.userSetPorts}
          handlePortChange={this.handlePortChange}
        />
        <SpecialPermissions />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  diskSpaceAvailable: selector.diskSpaceAvailable,
  installedPackages: selector.installedPackages
});

const mapDispatchToProps = dispatch => ({
  install: ({
    id,
    envs,
    isCORE,
    userSetVols,
    userSetPorts,
    ports,
    options
  }) => {
    dispatch(action.install({ id, userSetVols, userSetPorts, options }));
    dispatch(action.updateEnv({ id, envs, isCORE }));
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
