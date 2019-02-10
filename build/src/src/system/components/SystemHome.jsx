import React from "react";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Modules
import packages from "packages";
import installer from "installer";
// Components
import UpdateSystem from "./UpdateSystem";
import StaticIp from "./StaticIp";
// Styles
import "packages/components/packages.css";

const PackageList = packages.components.PackageList;

const SystemHome = ({ coreProgressLogs }) => (
  <React.Fragment>
    <div className="section-title capitalize">{NAME}</div>

    {coreProgressLogs ? (
      <installer.components.ProgressLog
        progressLog={coreProgressLogs}
        subtitle={"Updating DAppNode..."}
      />
    ) : null}

    <UpdateSystem />

    <StaticIp />

    <div className="section-subtitle">Packages</div>
    <PackageList moduleName={NAME} coreDnps={true} />
  </React.Fragment>
);

// Container

const mapStateToProps = createStructuredSelector({
  coreProgressLogs: s.getCoreProgressLog
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemHome);
