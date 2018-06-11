import React from 'react';
import * as crossbarCalls from '../API/crossbarCalls';
import AppStore from 'Store';

let envInputTag = "envInput_"

class SubmitInstall extends React.Component {

  submit(event) {
    event.preventDefault();
    let envNames = this.props.manifest.image.environment || []
    let envs = {}
    envNames.map((env, i) => {
      envs[env] = document.getElementById(envInputTag+i).value
    })
    this.props.installPackage(envs)
    return false;
  }

  render() {

    let manifest = this.props.manifest
    if (!manifest) return null
    if (typeof manifest != 'object') return null
    if (!manifest.image) return null

    let envs = manifest.image.environment || []

    let rows = envs.map((env, i) => {
      const envName = env.split('=')[0]
      const envValue = env.split('=')[1] || ''
      return (
        <div key={i} class="form-row">
          <div class="mb-3">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupPrepend">
                  {envName}
                </span>
              </div>
              <input type="text" class="form-control"
                id={envInputTag+i}
                placeholder={'enter value...'}
                aria-describedby="inputGroupPrepend"
                required
                defaultValue={envValue}
              >
              </input>
            </div>
          </div>
        </div>
      )
    })


    return (
      <form class="needs-validation">
        {rows}
        <button class="btn btn-primary dappnode-background-color" type="submit" data-dismiss="modal"
          onClick={this.submit.bind(this)}
          disabled={this.props.disabled}
          >
          {this.props.disabled ? 'INSTALLED' : 'INSTALL'}
        </button>
      </form>
    )
  }
}

class PackageInfoTable extends React.Component {
  render() {

    // verify manifest's integrity
    let manifest = this.props.manifest
    if (!manifest) return null
    if (typeof manifest == 'string') return (
      <div class="alert alert-danger" role="alert">Error fetching manifest: {manifest}</div>
    )
    else if (typeof manifest != 'object') return (
      <div class="alert alert-danger" role="alert">Broken package manifest</div>
    )
    else if (manifest.hasOwnProperty('error') && manifest.error) {
      console.log('Error fetching manifest, error progragated from the back end: ', manifest)
      return (
        <div class="alert alert-danger" role="alert">Error fetching manifest, open console for more info</div>
      )
    }

    let tableItems = [
      {key: 'Description', val: manifest.description || ''},
      {key: 'Mantainer', val: manifest.author || ''},
      {key: 'Type', val: manifest.type || ''},
      {key: 'Size', val: manifest.image ? manifest.image.size || '' : ''},
      {key: 'Image path', val: manifest.image ? manifest.image.path || '' : ''}
    ]

    let rows = tableItems.map((row, i) => {
      return (
        <tr key={i}>
          <th scope="row">{row.key}</th>
          <td>{row.val}</td>
        </tr>
      )
    })

    return (
      <div class="table-responsive">
        <table class="table">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}


export default class InstallerModal extends React.Component {
  constructor() {
    super();
  }

  changeVersion(e) {
    this.props.changeVersion(e.target.value)
  }

  render() {

    // This should get:
    // - specific package info object
    // - installer call

    // console.log('this.state.packageInfo', this.state.packageInfo)



    // let name = this.props.package.name
    // let namePretty = capitalize( name.split('.dnp.dappnode.eth')[0] )
    // let img = imageArchie[name] || defaultImg

    // <select class="form-control custom-select"
    //   id={id+'@version'}
    //   >
    //     {options}
    // </select>

    // Mix the latest manifest with the versions that are fetched in the backend
    const latestVersion = {
      version: 'latest',
      manifest: (this.props.packageData && this.props.packageData.manifest) ? this.props.packageData.manifest : {}
    }
    const versions = (this.props.packageInfo && this.props.packageInfo.versions) ? this.props.packageInfo.versions : []
    if (!versions.find(v => v.version === 'latest')) versions.unshift(latestVersion)

    // Construct variables
    const options = versions.map((version, i) => {
      return <option key={i}>{version.version}</option>
    })
    const packageName = this.props.targetPackageName
    const manifest = versions[this.props.versionIndex].manifest

    return (
      <div class="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Installing: {packageName}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">Package version</label>
                </div>
                <select class="custom-select" id="inputGroupSelect01"
                  onChange={this.changeVersion.bind(this)}
                  value={this.props.version}
                  >
                  {options}
                </select>
              </div>

              <PackageInfoTable
                manifest={manifest}
              />

              <SubmitInstall
                manifest={manifest}
                disabled={this.props.disabled}
                installPackage={this.props.installPackage}
              />

            </div>
          </div>
        </div>
      </div>


    );
  }
}
