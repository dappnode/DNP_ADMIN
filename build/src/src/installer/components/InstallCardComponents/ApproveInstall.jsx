import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";
// Components
import SpecialPermissions from "./SpecialPermissions";
import Envs from "./Envs";
import Dependencies from "./Dependencies";

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

class ApproveInstallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { envs: {} };
    this.handleEnvChange = this.handleEnvChange.bind(this);
    this.approveInstall = this.approveInstall.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
    install: PropTypes.func.isRequired
  };

  handleEnvChange(value, name) {
    this.setState({
      envs: {
        ...this.state.envs,
        [name]: value
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
    this.props.install(this.props.id, envs, ports);
  }

  render() {
    const manifest = this.props.manifest;
    const envs = parseEnvs(manifest);

    // Disable button:
    let disable = false;
    if (this.props.installTag === "installed") disable = true;

    const installAvailable = this.props.request && this.props.request.success;

    return (
      <React.Fragment>
        <SpecialPermissions />
        <Envs envs={envs} handleEnvChange={this.handleEnvChange} />
        <Dependencies request={this.props.request || {}} />
        <button
          className="btn dappnode-background-color"
          type="submit"
          data-dismiss="modal"
          onClick={this.approveInstall}
          disabled={disable || !installAvailable}
        >
          {"INSTALL"}
        </button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => ({
  install: (id, envs, ports) => {
    dispatch(action.install(id));
    dispatch(action.updateEnv(envs, id));
    dispatch(action.openPorts(ports));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveInstallView);
