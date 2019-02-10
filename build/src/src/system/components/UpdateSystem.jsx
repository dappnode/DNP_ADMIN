import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as a from "../actions";
import * as s from "../selectors";
import { connect } from "react-redux";

const margin = "5px";
const padding = "0.7rem";
const width = "108px";

const UpdateSystem = props => {
  const coreDeps = props.coreDeps;

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
            {coreDeps.map((dep, i) => (
              <div key={i} className="row">
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
              onClick={props.updateCore}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>
      <div className="section-subtitle">Packages</div>
    </React.Fragment>
  );
};

UpdateSystem.propTypes = {
  coreDeps: PropTypes.array.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: s.coreDeps
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore: a.updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateSystem);
