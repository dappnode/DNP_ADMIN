import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import { shortName } from "utils/format";
import { colors } from "utils/format";
import { connect } from "react-redux";
import * as action from "../actions";
import confirmPackageRemove from "./confirmPackageRemove";
// utils
import parsePorts from "utils/parsePorts";

class PackageRowView extends React.Component {
  static propTypes = {
    moduleName: PropTypes.string.isRequired
  };

  render() {
    let pkg = this.props.pkg || {};
    let id = pkg.name;
    let state = pkg.state;

    let stateColor;
    if (state === "running") stateColor = colors.success;
    else if (state === "exited") stateColor = colors.error;
    else stateColor = colors.default;

    const margin = "5px";
    const padding = "0.7rem";
    const width = "85px";

    return (
      <div className="card mb-3" id={id}>
        <div className="card-body" style={{ padding }}>
          <div className="row">
            <div className="col-sm" style={{ margin, overflow: "hidden" }}>
              <h5 className="card-title" style={{ marginBottom: "3px" }}>
                {shortName(this.props.pkg.name)}
              </h5>
              <div className="card-text">
                <span style={{ opacity: "0.5" }}>
                  {"version " + pkg.version}
                  {pkg.origin ? " (ipfs)" : ""}
                </span>
                <span
                  className="stateBadge"
                  style={{ backgroundColor: stateColor }}
                >
                  {state}
                </span>
              </div>
            </div>
            <div className="col-sm pkg-row-text" style={{ margin }}>
              <div className="btn-group float-right" role="group">
                <Link
                  className="btn btn-outline-secondary float-right"
                  style={{ width }}
                  to={"/" + this.props.moduleName + "/" + pkg.name}
                >
                  Open
                </Link>
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ width, paddingLeft: "0px", paddingRight: "0px" }}
                  onClick={() =>
                    confirmPackageRemove(pkg, this.props.removePackage)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => {
  return {
    removePackage: (pkg, deleteVolumes) => {
      dispatch(action.removePackage({ id: pkg.name, deleteVolumes }));
      const ports = parsePorts(pkg.manifest || {});
      if (ports.length) dispatch(action.closePorts(ports));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageRowView);
