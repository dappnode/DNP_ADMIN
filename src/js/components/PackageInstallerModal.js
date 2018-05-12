import React from 'react';
import * as crossbarCalls from './API/crossbarCalls';
import PackageList from './PackageList';
import PackageDirectory from './PackageDirectory';
import PackageStore from './PackageStore';
import LogMessage from './LogMessage';
import Log from './Log';
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
      return (
        <div key={i} class="form-row">
          <div class="mb-3">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupPrepend">
                  {env}
                </span>
              </div>
              <input type="text" class="form-control" id={envInputTag+i} placeholder={env} aria-describedby="inputGroupPrepend" required>
              </input>
              <div class="invalid-feedback">
                Please provide a valid variable
              </div>
              <div class="valid-feedback">
                Looks good!
              </div>
            </div>
          </div>
        </div>
      )
    })


    return (
      <form class="needs-validation" novalidate>
        {rows}
        <div class="form-group">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
            </input>
            <label class="form-check-label" for="invalidCheck">
              Agree to terms and conditions
            </label>
            <div class="invalid-feedback">
              You must agree before submitting.
            </div>
          </div>
        </div>
        <button class="btn btn-primary" type="submit" data-dismiss="modal"
          onClick={this.submit.bind(this)}
          >
          Install package
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
    if (typeof manifest != 'object') return (
      <div class="alert alert-danger" role="alert">Broken package manifest</div>
    )

    let tableItems = [
      {key: 'Description', val: manifest.description},
      {key: 'Mantainer', val: manifest.author},
      {key: 'Package type', val: manifest.type},
      {key: 'Package size', val: manifest.image.size},
      {key: 'Image path', val: manifest.image.path}
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
      <table class="table">
        <tbody>
          {rows}
        </tbody>
      </table>

    )
  }
}


export default class PackageInstallerModal extends React.Component {
  constructor() {
    super();
  }

  changeVersion(event) {
    this.props.changeVersion(event.target.value)
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
    let packageName, manifest, manifestHash, options
    if (this.props.packageInfo) {
      packageName = this.props.packageInfo.name
      manifest = this.props.packageInfo.versions[this.props.versionIndex].manifest
      manifestHash = this.props.packageInfo.versions[this.props.versionIndex].manifestHash

      let versions = this.props.packageInfo.versions
      options = versions.map((version, i) => {
        return <option key={i}>{version.version}</option>
      })

    } else {
      packageName = manifest = manifestHash = options = ''
    }


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
                installPackage={this.props.installPackage}
              />

            </div>
          </div>
        </div>
      </div>


    );
  }
}
