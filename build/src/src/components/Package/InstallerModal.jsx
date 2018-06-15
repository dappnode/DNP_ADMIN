import React from "react";
import getTag from "utils/getTag";

let envInputTag = "envInput_";

class SubmitInstall extends React.Component {
  submit(event) {
    event.preventDefault();
    let envNames = this.props.manifest.image.environment || [];
    let envs = {};
    envNames.forEach((env, i) => {
      envs[env] = document.getElementById(envInputTag + i).value;
    });
    this.props.installPackage(envs);
    return false;
  }

  render() {
    let manifest = this.props.manifest;
    if (!manifest) return null;
    if (typeof manifest !== typeof {}) return null;
    if (!manifest.image) return null;

    // let tag = pkg.manifest
    //   ? getTag(pkg.currentVersion, pkg.manifest.version)
    //   : "loading";

    let envs = manifest.image.environment || [];

    let rows = envs.map((env, i) => {
      const envName = env.split("=")[0];
      const envValue = env.split("=")[1] || "";
      return (
        <div key={i} className="form-row">
          <div className="mb-3">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend">
                  {envName}
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id={envInputTag + i}
                placeholder={"enter value..."}
                aria-describedby="inputGroupPrepend"
                required
                defaultValue={envValue}
              />
            </div>
          </div>
        </div>
      );
    });

    return (
      <form className="needs-validation">
        {rows}
        <button
          className="btn btn-primary dappnode-background-color"
          type="submit"
          data-dismiss="modal"
          onClick={this.submit.bind(this)}
          disabled={this.props.disableInstall}
        >
          {this.props.disableInstall ? "INSTALLED" : "INSTALL"}
        </button>
      </form>
    );
  }
}

class PackageInfoTable extends React.Component {
  render() {
    // verify manifest's integrity
    let manifest = this.props.manifest;
    if (!manifest) return null;
    if (typeof manifest === typeof "string")
      return (
        <div className="alert alert-danger" role="alert">
          Error fetching manifest: {manifest}
        </div>
      );
    else if (typeof manifest !== typeof {})
      return (
        <div className="alert alert-danger" role="alert">
          Broken package manifest
        </div>
      );
    else if (manifest.hasOwnProperty("error") && manifest.error) {
      return (
        <div className="alert alert-danger" role="alert">
          Error fetching manifest: {JSON.stringify(manifest.message)}
        </div>
      );
    }

    let tableItems = [
      { key: "Description", val: manifest.description || "" },
      { key: "Mantainer", val: manifest.author || "" },
      { key: "Type", val: manifest.type || "" },
      { key: "Size", val: manifest.image ? manifest.image.size || "" : "" },
      {
        key: "Image hash",
        val: manifest.image ? manifest.image.hash || "" : ""
      }
    ];

    let rows = tableItems.map((row, i) => {
      return (
        <tr key={i}>
          <th scope="row">{row.key}</th>
          <td>{row.val}</td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table">
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export default class InstallerModal extends React.Component {
  changeVersion(e) {
    this.props.changeVersion(e.target.value);
  }

  render() {
    const versions = this.props.versions;

    // Mix the latest manifest with the versions that are fetched in the backend
    if (
      // Make sure the latest version is not already in the array
      !versions.find(v => v.version === "latest") &&
      // Verify that the manifest exist so the latest version is not empty
      this.props.packageData &&
      this.props.packageData.manifest
    )
      versions.unshift({
        version: "latest",
        manifest: this.props.packageData.manifest
      });

    // Construct variables
    const options = versions.map((version, i) => {
      return <option key={i}>{version.version}</option>;
    });
    const packageName = this.props.targetPackageName;
    const manifest = versions[this.props.versionIndex]
      ? versions[this.props.versionIndex].manifest
      : {};

    // Check if allow install or not
    let disableInstall;
    if (
      this.props.packageData &&
      this.props.packageData.manifest &&
      getTag(
        this.props.packageData.currentVersion,
        this.props.packageData.manifest.version
      ).toLowerCase() === "installed"
    )
      disableInstall = true;

    return (
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="exampleModalLabel"
                style={{ wordBreak: "break-all" }}
              >
                Installing: {packageName}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    Package version
                  </label>
                </div>
                <select
                  className="custom-select"
                  id="inputGroupSelect01"
                  onChange={this.changeVersion.bind(this)}
                  value={this.props.version}
                >
                  {options}
                </select>
              </div>

              <PackageInfoTable manifest={manifest} />

              <SubmitInstall
                manifest={manifest}
                disableInstall={disableInstall}
                installPackage={this.props.installPackage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
