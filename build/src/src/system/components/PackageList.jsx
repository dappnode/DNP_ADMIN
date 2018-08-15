import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
// Components
import PackageRow from "./PackageRow";
// Styles
import "./packages.css";

class UpdateSystem extends React.Component {
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
      <div className="card mb-3">
        <div className="card-body" style={{ padding }}>
          <div className="d-flex justify-content-between">
            <div style={{ margin }}>
              <h5 className="card-title">DAppNode System Update</h5>
            </div>

            <div className="btn-group" role="group" style={{ margin }}>
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
          <div className="card-text">
            <ul>
              {coreDeps.map((dep, i) => (
                <li key={i}>
                  {dep.name}: {dep.from} -> {dep.to}
                </li>
              ))}
            </ul>
            {alerts}
          </div>
        </div>
      </div>
    );
  }
}

class PackagesList extends React.Component {
  render() {
    return (
      <div className="body">
        <h1>System packages</h1>
        <br />

        <UpdateSystem
          coreDeps={this.props.coreDeps}
          updateCore={this.props.updateCore}
        />

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>State</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.corePackages.map((pkg, i) => (
                <PackageRow key={i} pkg={pkg} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  corePackages: selector.getCorePackages,
  dnpPackages: selector.getDnpPackages,
  coreDeps: selector.coreDeps
});

const mapDispatchToProps = dispatch => {
  return {
    updateCore: () => {
      dispatch(action.updateCore());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
