import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
// Modules
import installer from "pages/installer";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { getIsLoadingStrictById } from "services/loadingStatus/selectors";
import { getCoreDeps } from "services/coreUpdate/selectors";
import {
  loadingId as loadingIdCoreUpdate,
  coreName
} from "services/coreUpdate/data";
// Components
import StatusCard from "components/StatusCard";
import SystemUpdateDetails from "./SystemUpdateDetails";
import Loading from "components/generic/Loading";
import SubTitle from "components/SubTitle";

function SystemUpdate({ coreProgressLogs, isLoading, coreUpdateAvailable }) {
  return (
    <>
      <SubTitle>Update</SubTitle>
      {/* This component will automatically hide if logs are empty */}
      <installer.components.ProgressLogs progressLogs={coreProgressLogs} />

      {isLoading ? (
        <Loading msg="Checking core version..." />
      ) : coreUpdateAvailable ? (
        <SystemUpdateDetails />
      ) : (
        <StatusCard success message="System up to date" />
      )}
    </>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  coreProgressLogs: state => getProgressLogsByDnp(state, coreName),
  isLoading: getIsLoadingStrictById(loadingIdCoreUpdate),
  coreUpdateAvailable: state => (getCoreDeps(state) || []).length > 0
});

export default connect(
  mapStateToProps,
  null
)(SystemUpdate);
