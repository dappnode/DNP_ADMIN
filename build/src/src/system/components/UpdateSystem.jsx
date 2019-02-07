import React from "react";

export default class UpdateSystem extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const width = "108px";

    const coreDeps = this.props.coreDeps;

    if (!coreDeps.length) return null;

    let alertMessages = [];
    if (coreDeps.find(dep => dep.name.includes("dappmanager.dnp"))) {
      alertMessages.push(
        "The bottom right message updating the progress of the installation will never resolve, refresh to see changes."
      );
    }
    if (coreDeps.find(dep => dep.name.includes("vpn.dnp"))) {
      alertMessages.push(
        "Your VPN connection will interrupted, please allow 30 seconds and reconnect again."
      );
    }
    if (coreDeps.find(dep => dep.name.includes("admin.dnp"))) {
      alertMessages.push("After the update refresh to apply the changes.");
    }

    const alerts = alertMessages.length ? (
      <p>
        <strong>Note during the update: </strong>
        {alertMessages.join(" ")}
      </p>
    ) : null;

    return (
      <React.Fragment>
        <div className="section-subtitle">DAppNode System Update</div>
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="card-text" style={{ margin }}>
              <div className="row">
                <div className="col-4" />
                <div className="col-4">Current version</div>
                <div className="col-4">Requested version</div>
              </div>
              {coreDeps.map(dep => (
                <div key={dep.name} className="row">
                  <div className="col-4 text-truncate">{dep.name}</div>
                  <div className="col-4 text-truncate">
                    {dep.from || "not installed"}
                  </div>
                  <div className="col-4 text-truncate">{dep.to}</div>
                </div>
              ))}
              <div className="mt-3">{alerts}</div>
            </div>
            <div
              className="btn-group float-right"
              role="group"
              style={{ margin }}
            >
              <button
                className="btn btn-outline-danger"
                type="button"
                style={{ width }}
                onClick={this.props.updateCore}
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
