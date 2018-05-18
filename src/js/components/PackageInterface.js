import React from 'react'
import * as crossbarCalls from './API/crossbarCalls'
import PackageList from './PackageList'
import LogMessage from './LogMessage'
import Terminal from './Terminal'
import Log from './Log'
import AppStore from 'Store'

let envInputTag = "envPckgInput_"

class EnvVariables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envs: this.props.envs
    }
  }

  changeEnv(env) {
    return function(e) {
      let envs = this.props.envs
      envs[env] = e.target.value
      this.setState({ envs })
    }
  }

  updateEnvs(e) {
    let id = e.currentTarget.id
    this.props.updateEnvs(id, this.state.envs)
  }

  render() {

    let envs = this.state.envs
    if (!envs) {
      return null
    }

    let envsList = Object.getOwnPropertyNames(envs).map((env, i) => {
      console.log(env + ' '+ envs[env])
      console.log('this.state.envs',this.state.envs)
      return (
        <div key={i} class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">{env}</span>
          </div>
          <input type="text" class="form-control"
            id={envInputTag+i}
            value={envs[env]}
            onChange={this.changeEnv(env).bind(this)}
            aria-label={env} aria-describedby="basic-addon1">
          </input>
        </div>
      )
    })

    return (
      <div>
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h4>Environment variables</h4>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-outline-secondary tableAction-button"
                id={this.props.id}
                onClick={this.updateEnvs.bind(this)}
              >Update environment variables</button>
            </div>
          </div>
        </div>
        <div class='border-bottom mb-4'>
          {envsList}
        </div>
      </div>
    )
  }
}



export default class PackageInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      packageList: AppStore.getPackageList(),
      log: AppStore.getLog('packageManager'),
      packageLog: AppStore.getPackageLog()
    };
    this.updatePackageList = this.updatePackageList.bind(this)
    this.updateLog = this.updateLog.bind(this)
    this.updatePackageLog = this.updatePackageLog.bind(this)
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

  removePackageInTable(e) {
    console.log('e.currentTarget.id',e.currentTarget.id)
    crossbarCalls.removePackage(e.currentTarget.id)
    this.props.history.push('/packages')
  }

  togglePackageInTable(e) {
    crossbarCalls.togglePackage(e.currentTarget.id);
  }

  logPackageInTable(e) {
    crossbarCalls.logPackage(e.currentTarget.id);
  }

  callUpdateEnvs(id, envs) {
    crossbarCalls.updatePackageEnv(id, envs, true);
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

  updatePackageLog() {
    this.setState({
      packageLog: AppStore.getPackageLog()
    });
  }

  render() {
    let packageName = this.props.match.params.packageName
    let _package = this.state.packageList
      .find( _package => _package.shortName == packageName );

    if (!_package) {
      return (
        <div class="alert" role="alert">
          Loading {packageName} ... (if this take too long, package may be missing or misspelled)
        </div>
      )
    }

    let id = _package.name
    let state = _package.state

    let toggleButtonTag = ''
    if (state == 'running') toggleButtonTag = 'Pause'
    if (state == 'exited') toggleButtonTag = 'Start'

    // let packageProperties = Object.getOwnPropertyNames(_package)
    // remove(packageProperties, ['id', 'isDNP', 'running', 'shortName'])

    let packageProperties = ['name', 'state', 'version', 'created', 'image', 'ports']

    let tableItems = packageProperties.map((prop, i) => {
      return (
        <tr key={i}>
          <th scope="row">{prop}</th>
          <td>{_package[prop]}</td>
        </tr>
      )
    })

    // Prepare logs
    let CONTAINER_NAME_PREFIX = "DAppNodePackage-"
    let rawLogs = this.state.packageLog[id] || ''
    let logs = rawLogs.replaceAll(CONTAINER_NAME_PREFIX+_package.name, _package.shortName)

    return (
      <div>

        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h1 class="h2">{capitalize(_package.shortName)} settings</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-outline-secondary tableAction-button"
                id={id}
                onClick={this.togglePackageInTable.bind(this)}
              >{toggleButtonTag}</button>
              <button type="button" class="btn btn-outline-danger tableAction-button"
                id={id}
                onClick={this.removePackageInTable.bind(this)}
              >Remove</button>
            </div>
          </div>
        </div>

        <div class='border-bottom mb-4'>
          <h4>Package details</h4>
          <table class="table table-hover">
            <tbody>
              {tableItems}
            </tbody>
          </table>
        </div>

        <EnvVariables
          envs={_package.envs}
          id={id}
          updateEnvs={this.callUpdateEnvs.bind(this)}
        />

        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h4>Logs</h4>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-outline-secondary tableAction-button"
                id={id}
                onClick={this.logPackageInTable.bind(this)}
              >Load logs</button>
            </div>
          </div>
        </div>
        <Terminal
        text={logs}
        />
      </div>

    );
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function remove(array, elements) {
  elements.forEach(function(element){
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
  })
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
