import React from "react";
import PropTypes from "prop-types";
// Components
import PackageInfoTable from "./InstallerModalParts/PackageInfoTable";
import SubmitInstall from "./InstallerModalParts/SubmitInstall";

export default class InstallerModal extends React.Component {
  static propTypes = {
    installTag: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    disableInstall: PropTypes.bool.isRequired,
    install: PropTypes.func.isRequired
  };

  render() {
    const manifest = this.props.manifest;

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
                Installing DAppNode package
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
