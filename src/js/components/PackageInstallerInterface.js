import React from 'react';
import * as VPNcall from './API/crossbarCalls';
import PackageList from './PackageList';
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
      log: AppStore.getLog('installer')
    };
  }
  componentWillMount() {
    AppStore.on("CHANGE", this.updatePackageList.bind(this));
    AppStore.on("CHANGE", this.updateLog.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList.bind(this));
    AppStore.removeListener("CHANGE", this.updateLog.bind(this));
  }

  handleAddPackage() {
    VPNcall.addPackage(this.state.packageLink);
    // session.'vpn.dappnode.addPackage'
  }
  handleRemovePackage() {
    VPNcall.removePackage(this.state.packageId);
  }
  handleReloadPackageList() {
    VPNcall.listPackages();
  }

  removePackageInTable(e) {
    VPNcall.removePackage(e.currentTarget.id);
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
        <PackageList
          packageList={this.state.packageList}
          removePackage={this.removePackageInTable.bind(this)}
        />
      </div>
    );
  }
}
