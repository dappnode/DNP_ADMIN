import React from "react";
import * as crossbarCalls from "API/crossbarCalls";
import AppStore from "stores/AppStore";
// Components
import PackageDetails from "./Package/PackageDetails";
import DisplayLogs from "./Package/DisplayLogs";
import EnvVariables from "./Package/EnvVariables";
import PackageControls from "./Package/PackageControls";

export default class PackageInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageList: AppStore.getPackageList(),
      log: AppStore.getLog("packageManager"),
      packageLog: AppStore.getPackageLog()
    };
    this.updatePackageList = this.updatePackageList.bind(this);
    this.updateLog = this.updateLog.bind(this);
    this.updatePackageLog = this.updatePackageLog.bind(this);
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updatePackageList);
    AppStore.on("CHANGE", this.updateLog);
    AppStore.on("CHANGE", this.updatePackageLog);
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList);
    AppStore.removeListener("CHANGE", this.updateLog);
    AppStore.removeListener("CHANGE", this.updatePackageLog);
  }

  handleAddPackage() {
    crossbarCalls.addPackage(this.state.packageLink);
    // session.'vpn.dappnode.addPackage'
  }
  handleRemovePackage() {
    crossbarCalls.removePackage(this.state.packageId);
  }
  handleReloadPackageList() {
    crossbarCalls.listPackages();
  }

  removePackageInTable(id, deleteVolumes) {
    crossbarCalls.removePackage(id, deleteVolumes);
    this.props.history.push("/packages");
  }

  togglePackageInTable(id, isCORE) {
    crossbarCalls.togglePackage(id, isCORE);
  }

  restartPackageInTable(id, isCORE) {
    crossbarCalls.restartPackage(id, isCORE);
  }

  restartPackageVolumes(id, isCORE) {
    crossbarCalls.restartPackageVolumes(id, isCORE);
  }

  logPackageInTable(id, isCORE, options) {
    crossbarCalls.logPackage(id, isCORE, options);
  }

  callUpdateEnvs(id, envs, isCORE) {
    crossbarCalls.updatePackageEnv(id, envs, true, isCORE);
  }

  updatePackageList() {
    this.setState({
      packageList: AppStore.getPackageList()
    });
  }

  updateLog() {
    this.setState({
      log: AppStore.getLog("installer")
    });
  }

  updatePackageLog() {
    this.setState({
      packageLog: AppStore.getPackageLog()
    });
  }

  render() {
    let packageName = this.props.match.params.packageName;
    let _package = this.state.packageList.find(
      _package => _package.shortName === packageName
    );

    if (!_package) {
      return (
        <div className="alert" role="alert">
          Loading {packageName} ... (if this take too long, package may be
          missing or misspelled)
        </div>
      );
    }

    let id = _package.name;

    // let packageProperties = Object.getOwnPropertyNames(_package)
    // remove(packageProperties, ['id', 'isDNP', 'running', 'shortName'])

    // Prepare logs
    let logs = this.state.packageLog[id] || "";

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h1>{capitalize(_package.shortName)} settings</h1>
        </div>

        <PackageDetails _package={_package} />

        <DisplayLogs
          id={id}
          isCORE={_package.isCORE}
          logs={logs}
          logPackage={this.logPackageInTable.bind(this)}
        />

        <EnvVariables
          id={id}
          isCORE={_package.isCORE}
          envs={_package.envs}
          updateEnvs={this.callUpdateEnvs.bind(this)}
        />

        <PackageControls
          id={id}
          isCORE={_package.isCORE}
          state={_package.state}
          togglePackage={this.togglePackageInTable.bind(this)}
          restartPackage={this.restartPackageInTable.bind(this)}
          restartPackageVolumes={this.restartPackageVolumes.bind(this)}
          removePackage={this.removePackageInTable.bind(this)}
        />
      </div>
    );
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
