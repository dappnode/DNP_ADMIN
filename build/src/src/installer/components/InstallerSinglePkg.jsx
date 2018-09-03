import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import PackageInfoTable from "./InstallerModalParts/PackageInfoTable";
import SubmitInstall from "./InstallerModalParts/SubmitInstall";
import { push } from "connected-react-router";
import { NAME } from "../constants";
import * as utils from "../utils";
import eventBus from "eventBus";
import Loading from "components/Loading";
import Error from "components/Error";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";
// Components
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class InstallerInterfaceView extends React.Component {
  componentWillMount() {
    const url = this.props.match.params.id;
    const id = utils.urlToId(url);
    token = eventBus.subscribe("connection_open", () => {
      this.props.fetchPackageRequest(id);
    });
    if (isOpen()) this.props.fetchPackageRequest(id);
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

  render() {
    const url = this.props.match.params.id;
    const id = utils.urlToId(url);
    const pkg = this.props.packageData[id];
    const connectionOpen = this.props.connectionOpen;

    if (!connectionOpen) {
      return <Loading msg="Openning connection..." />;
    }

    if (!pkg || pkg.error) {
      return <Error msg={"Package " + id + " not found"} />;
    }

    if (pkg.fetching) {
      return <Loading msg={"Fetching " + id + "..."} />;
    }

    const manifest = pkg.manifest || {};
    const avatar = pkg.avatar || defaultAvatar;
    const pkgProgressId = this.props.isInstalling[id];
    const progressLog = pkgProgressId
      ? this.props.progressLog[pkgProgressId]
      : null;

    // let packageProperties = Object.getOwnPropertyNames(_package)
    // remove(packageProperties, ['id', 'isDNP', 'running', 'shortName'])
    const size = manifest.image ? humanFileSize(manifest.image.size) || "" : "";
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h1>Install {manifest.name}</h1>
        </div>
        {/* Package info */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">{manifest.name}</h4>
            <div className="row">
              <div className="col-4" style={{ maxWidth: 200 }}>
                <img src={avatar} className="card-img-top" alt="Avatar" />
              </div>
              <div className="col-8">
                <p>{manifest.description}</p>
                <p>By {manifest.author}</p>
                <p>
                  Version {manifest.version} ({size})
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Package installation progress */}
        {progressLog ? (
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Installing...</h4>
              <ul>
                {Object.keys(progressLog.msg || {}).map((item, i) => (
                  <li key={i}>{item + ": " + progressLog.msg[item]}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Depedencies</h4>
              <ul>
                {Object.keys(manifest.dependencies || {}).map((dep, i) => (
                  <li key={i}>{dep + ": " + manifest.dependencies[dep]}</li>
                ))}
              </ul>
              {!Object.keys(manifest.dependencies || {}).length ? (
                <p className="card-text">No dependencies</p>
              ) : null}

              <h4 className="card-title">Special Permissions</h4>
              <p className="card-text">Requires no special permissions</p>
              <SubmitInstall
                id={id}
                manifest={manifest}
                installTag={"INSTALL"}
                disableInstall={this.props.disableInstall}
                install={this.props.install}
              />
            </div>
          </div>
        )}
        {/* Package installation request and approval */}
      </div>
    );
  }
}

{
  /* <Controls
  state={pkg.state}
  togglePackage={() => this.props.togglePackage(id)}
  restartPackage={() => this.props.restartPackage(id)}
  restartPackageVolumes={() => this.props.restartPackageVolumes(id)}
  removePackage={() => this.props.removePackage(id, ports)}
  removePackageAndData={() => this.props.removePackageAndData(id, ports)}
/>; */
}

// Container

const mapStateToProps = createStructuredSelector({
  directory: selector.getDirectoryNonCores,
  packageData: selector.packageData,
  isInstalling: selector.isInstalling,
  progressLog: selector.progressLog,
  connectionOpen: selector.connectionOpen
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPackageRequest: id => {
      dispatch(action.fetchPackageData(id));
    },
    install: (id, envs, ports) => {
      dispatch(action.install(id));
      dispatch(action.updateEnv(envs, id));
      dispatch(action.openPorts(ports));
    }
    // removePackageAndData: (id, ports) => {
    //   dispatch(action.removePackage({ id, deleteVolumes: true }));
    //   if (ports.length) dispatch(action.closePorts({ action: "close", ports }));
    //   dispatch(push("/" + NAME));
    // }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerInterfaceView);
