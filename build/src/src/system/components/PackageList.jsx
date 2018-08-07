import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
// Components
import PackageRow from "./PackageRow";
// Styles
import "./packages.css";

class UpdateSystem extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const width = "108px";

    return (
      <div className="card mb-3">
        <div className="card-body" style={{ padding }}>
          <div>
            <div className="float-left" style={{ margin }}>
              <h5 className="card-title">DAppNode System Update</h5>
              <div className="card-text">
                <ul>
                  <li>vpn.dnp.dappnode.eth: 0.1.3 -> 0.1.4</li>
                  <li>admin.dnp.dappnode.eth: 0.1.5 -> 0.1.6</li>
                  <li>dappmanager.dnp.dappnode.eth: 0.1.8 -> 0.1.9</li>
                </ul>
              </div>
            </div>
            <div>
              <div
                className="btn-group float-right"
                role="group"
                style={{ margin }}
              >
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ width }}
                  onClick={() => {}}
                >
                  UPDATE
                </button>
              </div>
            </div>
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

        <UpdateSystem />

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
  dnpPackages: selector.getDnpPackages
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
