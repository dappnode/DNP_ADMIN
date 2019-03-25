import React from "react";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
import { title } from "../data";
// Modules
import installer from "pages/installer";
// Components
import SystemUpdateDetails from "./SystemUpdateDetails";

const SystemUpdate = ({ coreProgressLogs }) => (
  <React.Fragment>
    <div className="section-title">
      <span className="pre-title">{title} </span>
      Update
    </div>

    {coreProgressLogs ? (
      <installer.components.ProgressLog
        progressLog={coreProgressLogs}
        subtitle={"Updating..."}
      />
    ) : null}

    <div className="section-subtitle">Details</div>
    <SystemUpdateDetails />
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
)(SystemUpdate);
