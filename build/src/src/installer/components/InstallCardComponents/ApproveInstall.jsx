import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";
// Components
import SpecialPermissions from "./SpecialPermissions";
import Envs from "./Envs";
import Dependencies from "./Dependencies";
import Details from "./Details";
import { Link } from "react-router-dom";
import packages from "packages";
// style
import "./checkbox.css";

/**
 * Parses envs
 * @param {object} manifest
 * @return {object} {envName: 'envValue'}
 */
function parseEnvs(manifest) {
  const envsObj = {};
  (((manifest || {}).image || {}).environment || []).forEach(env => {
    const [name, value] = env.split("=");
    envsObj[name] = value;
  });
  return envsObj;
}

/**
 * Parses ports
 * @param {object} manifest
 * @return {array} ['8080', '4001']
 */
function parsePorts(manifest) {
  return (((manifest || {}).image || {}).ports || []).map(p => p.split(":")[0]);
}

const options = ["BYPASS_CORE_RESTRICTION"];

class ApproveInstallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envs: {},
      options: {
        BYPASS_CORE_RESTRICTION: false
      }
    };
    this.handleEnvChange = this.handleEnvChange.bind(this);
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
    const envs = {
      ...parseEnvs(this.props.manifest),
      ...this.state.envs
    };
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
    this.props.install(id, envs, ports, options);
  }

  render() {
    const manifest = this.props.manifest;
    const envs = parseEnvs(manifest);

    // Get install tag: INSTALL / UPDATE / INSTALLED
    let tag = this.props.pkg.tag || "INSTALL";

    const installAvailable = this.props.request && this.props.request.success;

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
          {this.props.id && this.props.id.startsWith("/ipfs/")
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
        <SpecialPermissions />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => ({
  install: (id, envs, ports, options) => {
    dispatch(action.install(id, options));
    dispatch(action.updateEnv(envs, id));
    dispatch(action.openPorts(ports));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveInstallView);
