import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { shortName } from "utils/format";
import { colors } from "utils/format";
import { connect } from "react-redux";
import * as action from "../actions";
import confirmRemovePackage from "./confirmRemovePackage";

const margin = "5px";
const padding = "0.7rem";
const width = "85px";

const PackageRowView = ({ dnp = {}, removePackage, moduleName }) => (
  <div className="card mb-3">
    <div className="card-body" style={{ padding }}>
      <div className="row">
        <div className="col-sm" style={{ margin, overflow: "hidden" }}>
          <h5 className="card-title" style={{ marginBottom: "3px" }}>
            {shortName(dnp.name)}
          </h5>
          <div className="card-text">
            <span style={{ opacity: "0.5" }}>
              {"version " + dnp.version}
              {dnp.origin ? " (ipfs)" : ""}
            </span>
            <span
              className="stateBadge"
              style={{
                backgroundColor:
                  dnp.state === "running"
                    ? colors.success
                    : dnp.state === "exited"
                    ? colors.error
                    : colors.default
              }}
            >
              {dnp.state}
            </span>
          </div>
        </div>
        <div className="col-sm pkg-row-text" style={{ margin }}>
          <div className="btn-group float-right" role="group">
            <Link
              className="btn btn-outline-secondary float-right"
              style={{ width }}
              to={`/${moduleName}/${dnp.name}`}
            >
              Open
            </Link>
            {!(dnp.isCore || dnp.isCORE) && (
              <button
                className="btn btn-outline-danger"
                type="button"
                style={{ width, paddingLeft: "0px", paddingRight: "0px" }}
                onClick={() => confirmRemovePackage(dnp.name, removePackage)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

PackageRowView.propTypes = {
  dnp: PropTypes.object.isRequired,
  moduleName: PropTypes.string.isRequired
};

// Container

const mapStateToProps = null;

const mapDispatchToProps = {
  removePackage: action.removePackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageRowView);
