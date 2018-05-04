import React from 'react';
import * as crossbarCalls from './API/crossbarCalls';
import PackageList from './PackageList';
import PackageDirectory from './PackageDirectory';
import LogMessage from './LogMessage';
import Log from './Log';
import AppStore from 'Store';

export default class PackageInstallerInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      packageLink: 'otpweb.dnp.dappnode.eth',
      packageId: '',
      packageList: AppStore.getPackageList(),
      directory: AppStore.getDirectory(),
      log: AppStore.getLog('installer')
    };
  }
  componentWillMount() {
    AppStore.on("CHANGE", this.updatePackageList.bind(this));
    AppStore.on("CHANGE", this.updateLog.bind(this));
    AppStore.on("CHANGE", this.updateDirectory.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList.bind(this));
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

  removePackageInTable(e) {
    console.log('e.currentTarget.id',e.currentTarget.id)
    crossbarCalls.removePackage(e.currentTarget.id);
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

  updatePackageList() {
    this.setState({
      packageList: AppStore.getPackageList()
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
      <div class='body'>
        <br></br>
        Package link:
        <input value={this.state.packageLink}
        onChange={this.updatePackageLink.bind(this)}/>
        <button
        onClick={this.handleAddPackage.bind(this)}>Add package</button>
        <br></br>
        <br></br>
        <Log
          log={this.state.log}
        />
        <LogMessage />
        <br></br>
        <PackageDirectory
          directory={this.state.directory}
          installPackage={this.installPackageInTable.bind(this)}
        />
        <PackageList
          packageList={this.state.packageList}
          removePackage={this.removePackageInTable.bind(this)}
        />
      </div>
    );
  }
}
