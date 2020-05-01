import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
// Modules
import installer from "pages/installer";
// Selectors
import { getProgressLogsOfDnp } from "services/isInstallingLogs/selectors";
import { getIsLoadingStrictById } from "services/loadingStatus/selectors";
import { getCoreUpdateAvailable } from "services/coreUpdate/selectors";
import {
  loadingId as loadingIdCoreUpdate,
  coreName
} from "services/coreUpdate/data";
// Components
import Card from "components/Card";
import StatusIcon from "components/StatusIcon";
import SystemUpdateDetails from "./SystemUpdateDetails";
import Loading from "components/Loading";
import SubTitle from "components/SubTitle";
import { ProgressLogs } from "types";

function SystemUpdate({
  coreProgressLogs,
  isLoading,
  coreUpdateAvailable
}: {
  coreProgressLogs: ProgressLogs | undefined;
  isLoading: boolean;
  coreUpdateAvailable: boolean;
}) {
  return (
    <>
      <SubTitle>Update</SubTitle>
      {/* This component will automatically hide if logs are empty */}
      <installer.components.ProgressLogsView progressLogs={coreProgressLogs} />

      {isLoading ? (
        <Loading msg="Checking core version..." />
      ) : coreUpdateAvailable ? (
        <SystemUpdateDetails />
      ) : (
        <Card spacing>
          <StatusIcon success message="System up to date" />
        </Card>
      )}
    </>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  coreProgressLogs: state => getProgressLogsOfDnp(state, coreName),
  isLoading: getIsLoadingStrictById(loadingIdCoreUpdate),
  coreUpdateAvailable: getCoreUpdateAvailable
});

export default connect(
  mapStateToProps,
  null
)(SystemUpdate);
