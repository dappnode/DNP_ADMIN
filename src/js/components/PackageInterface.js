import React from 'react';
import * as VPNcall from './API/crossbarCalls';
import PackageList from './PackageList';
import LogMessage from './LogMessage';
import AppStore from 'Store';

export default class PackageInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      packageLink: '',
      packageId: '',
      packageList: AppStore.getPackageList()
    };
  }
  componentWillMount() {
    AppStore.on("CHANGE", this.updatePackageList.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList.bind(this));
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
