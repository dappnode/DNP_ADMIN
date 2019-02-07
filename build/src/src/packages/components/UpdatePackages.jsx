import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as selector from "../selectors";
import { updateDnps } from "../actions";

class UpdatePackages extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const width = "108px";

    const dnps = this.props.dnpsToBeUpgraded;

    if (!dnps.length) return null;
    const plural = dnps.length > 1 ? "s" : "";

    return (
      <React.Fragment>
        <div className="section-subtitle">{`Update${plural} available`}</div>
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="card-text" style={{ margin }}>
              <div className="row">
                <div className="col-4" />
                <div className="col-4">Current version</div>
                <div className="col-4">Requested version</div>
              </div>
              {dnps.map(({ name, currentVersion, lastVersion }) => (
                <div key={name} className="row">
                  <div className="col-4 text-truncate">{name}</div>
                  <div className="col-4 text-truncate">
                    {currentVersion || "not installed"}
                  </div>
                  <div className="col-4 text-truncate">{lastVersion}</div>
                </div>
              ))}
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
                onClick={this.props.updateDnps}
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
        <div className="section-title" />
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  dnpsToBeUpgraded: selector.getDnpsToBeUpgraded
});

const mapDispatchToProps = { updateDnps };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePackages);
