import React from 'react';
import * as crossbarCalls from './API/crossbarCalls';
import PackageList from './PackageList';
import PackageDirectory from './PackageDirectory';
import PackageStore from './PackageStore';
import LogMessage from './LogMessage';
import Log from './Log';
import AppStore from 'Store';

export default class PackageInstallerInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageLink: 'otpweb.dnp.dappnode.eth',
      packageId: '',
      directory: AppStore.getDirectory(),
      log: AppStore.getLog('installer')
    };
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updateLog.bind(this));
    AppStore.on("CHANGE", this.updateDirectory.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateLog.bind(this));
    AppStore.removeListener("CHANGE", this.updateDirectory.bind(this));
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

  installPackageInTable(e) {
    let packageName = e.currentTarget.id
    var version = document.getElementById(packageName+'@version').value;
    crossbarCalls.addPackage(packageName + '@' + version);
  }

  updatePackageLink(e) {
    this.setState({
      packageLink: e.target.value
    });
  }

  updatePackageId(e) {
    this.setState({
      packageId: e.target.value
    });
  }

  updateDirectory() {
    this.setState({
      directory: AppStore.getDirectory()
    });
  }

  updateLog() {
    this.setState({
      log: AppStore.getLog('installer')
    });
  }

  render() {

    return (
      <div>
        <div class="page-header">
          <h1>Package installer</h1>
        </div>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Package .eth link" aria-describedby="basic-addon2"
            value={this.state.packageLink}
            onChange={this.updatePackageLink.bind(this)}
          ></input>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button"
              onClick={this.handleAddPackage.bind(this)}
            >Add package</button>
          </div>
        </div>

        <Log
          log={this.state.log}
        />

        <PackageStore
          directory={this.state.directory}
          installPackage={this.installPackageInTable.bind(this)}
        />

      </div>
    );
  }
}
