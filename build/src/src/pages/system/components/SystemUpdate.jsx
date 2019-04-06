import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { title } from "../data";
// Modules
import installer from "pages/installer";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { coreName } from "services/coreUpdate/data";
// Components
import SystemUpdateDetails from "./SystemUpdateDetails";
import Title from "components/Title";

const SystemUpdate = ({ coreProgressLogs }) => (
  <React.Fragment>
    <Title title={title} subtitle={"Update"} />

    {/* This component will automatically hide if logs are empty */}
    <installer.components.ProgressLogs progressLogs={coreProgressLogs} />

    <SystemUpdateDetails />
  </React.Fragment>
);

// Container

const mapStateToProps = createStructuredSelector({
  coreProgressLogs: state => getProgressLogsByDnp(state, coreName)
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdate);
