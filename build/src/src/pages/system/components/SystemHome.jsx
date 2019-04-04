import React from "react";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { rootPath, title } from "../data";
// Modules
import packages from "pages/packages";
// Components
import StaticIp from "./StaticIp";

const PackageList = packages.components.PackageList;

const width = "85px";

const SystemHome = ({ coreDeps }) => (
  <>
    <div className="section-title capitalize">{title}</div>

    {coreDeps.length ? (
      <div className="d-flex justify-content-between">
        <div className="section-subtitle">System Update</div>
        <div>
          <Link
            className="btn btn-outline-danger"
            to={rootPath + "/update"}
            style={{ width }}
          >
            Update
          </Link>
        </div>
      </div>
    ) : null}

    <StaticIp />

    <div className="section-subtitle">Packages</div>
    <PackageList moduleName={title} coreDnps={true} />
  </>
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
