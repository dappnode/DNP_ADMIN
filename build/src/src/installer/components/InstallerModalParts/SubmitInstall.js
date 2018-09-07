import React from "react";
import PropTypes from "prop-types";

let envInputTag = "envInput_";

export default class SubmitInstall extends React.Component {
  submit(event) {
    event.preventDefault();
    let manifest = this.props.manifest || {};
    let image = manifest.image || {};
    // Get envs
    let envNames = image.environment || [];
    let envs = {};
    envNames.forEach((env, i) => {
      envs[env] = document.getElementById(envInputTag + i).value;
    });
    // Get ports
    let packagePorts = image.ports || [];
    let ports = packagePorts.map(p => p.split(":")[0]);
    // Call install
    this.props.install(this.props.id, envs, ports);
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

    // Disable button:
    let disable = false;
    if (this.props.installTag === "installed") disable = true;

    return (
      <form className="needs-validation">
        {rows.length ? (
          <h4 className="card-title">Environment Variables</h4>
        ) : null}
        {rows}
        <button
          className="btn dappnode-background-color"
          type="submit"
          data-dismiss="modal"
          onClick={this.submit.bind(this)}
          disabled={disable}
          style={{ textTransform: "uppercase" }}
        >
          {this.props.installTag}
        </button>
      </form>
    );
  }
}

SubmitInstall.propTypes = {
  manifest: PropTypes.object.isRequired,
  install: PropTypes.func.isRequired,
  disableInstall: PropTypes.bool.isRequired,
  installTag: PropTypes.string.isRequired
};
