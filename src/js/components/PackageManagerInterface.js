import React from 'react';
import * as crossbarCalls from './API/crossbarCalls';
import PackageList from './PackageList';
import LogMessage from './LogMessage';
import Log from './Log';
import AppStore from 'Store';

export default class PackageInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageList: AppStore.getPackageList(),
      log: AppStore.getLog('packageManager')
    };
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updatePackageList.bind(this));
    AppStore.on("CHANGE", this.updateLog.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList.bind(this));
    AppStore.removeListener("CHANGE", this.updateLog.bind(this));
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

  togglePackageInTable(e) {
    crossbarCalls.togglePackage(e.currentTarget.id);
  }

  logPackageInTable(e) {
    crossbarCalls.logPackage(e.currentTarget.id);
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
        <h1>Package manager</h1>
        <Log
          log={this.state.log}
        />
        <LogMessage />
        <br></br>
        <PackageList
          packageList={this.state.packageList}
          removePackage={this.removePackageInTable.bind(this)}
          togglePackage={this.togglePackageInTable.bind(this)}
          logPackage={this.logPackageInTable.bind(this)}
        />
      </div>
    );
  }
}
