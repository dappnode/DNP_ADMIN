import React from 'react'
import * as crossbarCalls from './API/crossbarCalls'
import PackageList from './PackageList'
import PackageDirectory from './PackageDirectory'
import PackageInstallerModal from './PackageInstallerModal'
import PackageStore from './PackageStore'
import LogMessage from './LogMessage'
import Log from './Log'
import LogProgress from './LogProgress'
import AppStore from 'Store'

export default class PackageInstallerInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageLink: 'otpweb.dnp.dappnode.eth',
      packageId: '',
      directory: AppStore.getDirectory(),
      log: AppStore.getLog('installer'),
      progressLog: AppStore.getProgressLog(),
      packageInfo: AppStore.getPackageInfo(),
      targetPackageName: '',
      versionIndex: 0,
      version: ''
    };
    this.updateLog = this.updateLog.bind(this)
    this.updateProgressLog = this.updateProgressLog.bind(this)
    this.updateDirectory = this.updateDirectory.bind(this)
    this.updatePackageInfo = this.updatePackageInfo.bind(this)
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updateLog);
    AppStore.on("CHANGE", this.updateProgressLog);
    AppStore.on("CHANGE", this.updateDirectory);
    AppStore.on("CHANGE", this.updatePackageInfo);
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateLog);
    AppStore.removeListener("CHANGE", this.updateProgressLog);
    AppStore.removeListener("CHANGE", this.updateDirectory);
    AppStore.removeListener("CHANGE", this.updatePackageInfo);
  }

  handleAddPackage() {
    this.preInstallPackage(this.state.packageLink)
    // session.'vpn.dappnode.addPackage'
  }
  handleRemovePackage() {
    crossbarCalls.removePackage(this.state.packageId);
  }
  handleReloadPackageList() {
    crossbarCalls.listPackages();
  }


  preInstallPackageInTable(e) {
    // Update target package (targetPackageName)
    let targetPackageName = e.currentTarget.id
    this.preInstallPackage(targetPackageName)
  }

  preInstallPackage(targetPackageName) {
    // Update target package (targetPackageName)
    this.setState({ targetPackageName });
    // Fetch package info
    crossbarCalls.fetchPackageInfo(targetPackageName);
    // Reset modal data
    this.setState({ versionIndex: 0 })
    this.setState({ version: '' })
  }

  installPackageInTable(envs) {
    let packageName = this.state.targetPackageName
    let version = this.state.packageInfo[this.state.targetPackageName]
      .versions[this.state.versionIndex].version
    console.log('ABOUT TO INSTALL PACKAGE',
    'packageName:',packageName,
    'version:',version,
    'envs:',envs)
    // let packageName = e.currentTarget.id
    // var version = document.getElementById(packageName+'@version').value;
    crossbarCalls.addPackage(packageName + '@' + version)
    // The third argument of updatePackageEnv must be false otherwise the install will throw
    crossbarCalls.updatePackageEnv(packageName, envs, false)
  }

  changeVersion(version) {
    let packageInfo = this.state.packageInfo[this.state.targetPackageName]
    let versions = packageInfo.versions.map(v => v.version)
    let versionIndex = versions.indexOf(version)
    if (versionIndex > -1) this.setState({ versionIndex })
    this.setState({ version })
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

  updateProgressLog() {
    this.setState({
      progressLog: AppStore.getProgressLog()
    });
    console.log('this.state.progressLog',JSON.stringify(this.state.progressLog))
  }

  updatePackageInfo() {
    this.setState({
      packageInfo: AppStore.getPackageInfo()
    });
  }



  render() {

    const modalId = "exampleModal"
    const modalTarget = "#"+modalId
    // console.log('PACKAGE INSTALLER LOGS',this.state.log,'this.state.packageInfo',this.state.packageInfo)

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
              data-toggle="modal"
              data-target={modalTarget}
              preInstallPackage={this.preInstallPackageInTable.bind(this)}
            >Install</button>
          </div>
        </div>

        <Log
          log={this.state.log}
        />

        <LogProgress
          progressLog={this.state.progressLog}
        />

        <PackageStore
          directory={this.state.directory}
          preInstallPackage={this.preInstallPackageInTable.bind(this)}
          modalTarget={modalTarget}
        />

        <PackageInstallerModal
          targetPackageName={this.state.targetPackageName}
          packageInfo={this.state.packageInfo[this.state.targetPackageName]}
          installPackage={this.installPackageInTable.bind(this)}
          changeVersion={this.changeVersion.bind(this)}
          versionIndex={this.state.versionIndex}
          version={this.state.version}
          modalId={modalId}
        />

      </div>
    );
  }
}
