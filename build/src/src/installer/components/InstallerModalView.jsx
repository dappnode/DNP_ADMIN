import React from "react";
import getTag from "utils/getTag";
import PropTypes from "prop-types";

import PackageInfoTable from "./InstallerModalParts/PackageInfoTable";
import SubmitInstall from "./InstallerModalParts/SubmitInstall";

export default class InstallerModal extends React.Component {
  static propTypes = {
    versions: PropTypes.array.isRequired,
    selectedVersion: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
    installTag: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    disableInstall: PropTypes.bool.isRequired,
    install: PropTypes.func.isRequired,
    updateSelectedVersion: PropTypes.func.isRequired
  };

  render() {
    // console.log(this.props);
    const options = this.props.versions.map((v, i) => (
      <option key={i} id={i}>
        {v}
      </option>
    ));

    const packageName = this.props.packageName;

    const manifest = this.props.manifest;
    // const manifest = versions[this.props.versionIndex]
    //   ? versions[this.props.versionIndex].manifest
    //   : {};

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
                  onChange={this.props.updateSelectedVersion}
                  value={this.props.selectedVersion}
                >
                  {options}
                </select>
              </div>

              <PackageInfoTable manifest={manifest} />

              <SubmitInstall
                manifest={manifest}
                installTag={this.props.installTag}
                disableInstall={this.props.disableInstall}
                install={this.props.install}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
