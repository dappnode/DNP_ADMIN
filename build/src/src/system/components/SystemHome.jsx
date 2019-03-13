import React from "react";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { NAME } from "../constants";
// Modules
import packages from "packages";
// Components
import StaticIp from "./StaticIp";
// Styles
import "packages/components/packages.css";

const PackageList = packages.components.PackageList;

const width = "85px";

const SystemHome = ({ coreDeps }) => (
  <React.Fragment>
    <div className="section-title capitalize">{NAME}</div>

    {coreDeps.length ? (
      <div className="d-flex justify-content-between">
        <div className="section-subtitle">System Update</div>
        <div>
          <Link
            className="btn btn-outline-danger"
            to={`/${NAME}/update`}
            style={{ width }}
          >
            Update
          </Link>
        </div>
      </div>
    ) : null}

    <StaticIp />

    <div className="section-subtitle">Packages</div>
    <PackageList moduleName={NAME} coreDnps={true} />
  </React.Fragment>
);

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: s.coreDeps
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemHome);
