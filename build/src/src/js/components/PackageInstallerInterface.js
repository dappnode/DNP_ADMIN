import React from 'react'
import * as crossbarCalls from './API/crossbarCalls'
import InstallerModal from './Package/InstallerModal'
import TypeFilter from './Package/TypeFilter'
import PackageStore from './Package/PackageStore'
import LogMessage from './LogMessage'
import ChainStatusLog from './ChainStatusLog'
import Log from './Log'
import LogProgress from './LogProgress'
import AppStore from 'Store'


export default class PackageInstallerInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageLink: '',
      packageId: '',
      selectedTypes: [],
      directory: AppStore.getDirectory(),
      packages: AppStore.getPackages(),
      disabled: AppStore.getDisabled(),
      log: AppStore.getLog('installer'),
      progressLog: AppStore.getProgressLog(),
      packageInfo: AppStore.getPackageInfo(),
      targetPackageName: '',
      chainStatus: AppStore.getChainStatus(),
      versionIndex: 0,
      version: ''
    };
    this.updateLog = this.updateLog.bind(this)
    this.updateProgressLog = this.updateProgressLog.bind(this)
    this.updateDirectory = this.updateDirectory.bind(this)
    this.updatePackageInfo = this.updatePackageInfo.bind(this)
    this.updateChainStatus = this.updateChainStatus.bind(this)
    this.updateDisabled = this.updateDisabled.bind(this)
    this.updatePackages = this.updatePackages.bind(this)
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updateLog);
    AppStore.on("CHANGE", this.updateProgressLog);
    AppStore.on("CHANGE", this.updateDirectory);
    AppStore.on("CHANGE", this.updatePackageInfo);
    AppStore.on("CHANGE", this.updateDisabled);
    AppStore.on("CHANGE", this.updatePackages);
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateLog);
    AppStore.removeListener("CHANGE", this.updateProgressLog);
    AppStore.removeListener("CHANGE", this.updateDirectory);
    AppStore.removeListener("CHANGE", this.updatePackageInfo);
    AppStore.removeListener("CHANGE", this.updateDisabled);
    AppStore.removeListener("CHANGE", this.updatePackages);
    AppStore.removeListener(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
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
    if (Object.getOwnPropertyNames(envs).length > 0) {
      crossbarCalls.updatePackageEnv(packageName, envs, false)
    }

  }

  changeVersion(version) {
    let packageInfo = this.state.packageInfo[this.state.targetPackageName]
    let versions = packageInfo.versions.map(v => v.version)
    let versionIndex = versions.indexOf(version)
    if (versionIndex > -1) this.setState({ versionIndex })
    this.setState({ version })
  }

  updatePackageLink(e) {
    this.setState({ packageLink: e.target.value });
  }
  updatePackageId(e) {
    this.setState({ packageId: e.target.value });
  }
  updateSelectedTypes(selectedTypes) {
    this.setState({ selectedTypes });
  }

  updateDirectory() {
    this.setState({ directory: AppStore.getDirectory() });
  }
  updateLog() {
    this.setState({ log: AppStore.getLog('installer') });
  }
  updateProgressLog() {
    this.setState({ progressLog: AppStore.getProgressLog() });
  }
  updatePackageInfo() {
    this.setState({ packageInfo: AppStore.getPackageInfo() });
  }
  updateChainStatus() {
    this.setState({ chainStatus: AppStore.getChainStatus() });
  }
  updateDisabled() {
    this.setState({ disabled: AppStore.getDisabled() });
  }
  updatePackages() {
    this.setState({ packages: AppStore.getPackages() });
  }


  render() {

    const filteredDirectory = Object.getOwnPropertyNames(this.state.packages)
    // Filter by name
    .filter(pkgName => pkgName.includes(this.state.packageLink))
    // Filter by type
    .filter(pkgName => {
      if (this.state.selectedTypes.length == 0) return true
      // Prevent the app from crashing with defective packages
      const pkg = this.state.packages[pkgName]
      if (pkg && pkg.manifest && pkg.manifest.type) {
        return this.state.selectedTypes.includes(pkg.manifest.type)
      } else if (pkg && pkg.manifest && !pkg.manifest.type) {
        return this.state.selectedTypes.includes('library')
      } else {
        return false
      }
    })
    // Reconstruct object with filtered keys
    .reduce((obj, key) => {
      obj[key] = this.state.packages[key];
      return obj;
    }, {});

    const modalId = "exampleModal"
    const modalTarget = "#"+modalId
    // console.log('PACKAGE INSTALLER LOGS',this.state.log,'this.state.packageInfo',this.state.packageInfo)

    const chainStatus = this.state.chainStatus || {}

    return (
      <div>
        <div class="page-header" id="top">
          <h1>Package installer</h1>
        </div>
        <div class="input-group mb-3">
          <input type="text" class="form-control"
            placeholder="Enter package's name or IPFS hash" aria-label="Package name" aria-describedby="basic-addon2"
            value={this.state.packageLink}
            onChange={this.updatePackageLink.bind(this)}
          ></input>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button"
              onClick={this.handleAddPackage.bind(this)}
              data-toggle="modal"
              data-target={modalTarget}
            >Install</button>
          </div>
        </div>

        <TypeFilter
          directory={this.state.packages}
          selectedTypes={this.state.selectedTypes}
          updateSelectedTypes={this.updateSelectedTypes.bind(this)}
        />

        <Log
          log={this.state.log}
        />

        <ChainStatusLog/>

        <LogProgress
          progressLog={this.state.progressLog}
        />

        <PackageStore
          directory={filteredDirectory}
          disabled={this.state.disabled}
          isSyncing={chainStatus.isSyncing}
          preInstallPackage={this.preInstallPackageInTable.bind(this)}
          modalTarget={modalTarget}
        />

        <InstallerModal
          targetPackageName={this.state.targetPackageName}
          packageInfo={this.state.packageInfo[this.state.targetPackageName]}
          packageData={this.state.packages[this.state.targetPackageName]}
          disabled={this.state.disabled[this.state.targetPackageName]}
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
