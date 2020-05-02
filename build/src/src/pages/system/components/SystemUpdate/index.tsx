import React from "react";
import { useSelector } from "react-redux";
// Modules
import installer from "pages/installer";
// Selectors
import { getProgressLogsOfDnp } from "services/isInstallingLogs/selectors";
import { getIsLoadingStrictById } from "services/loadingStatus/selectors";
import { getCoreUpdateAvailable } from "services/coreUpdate/selectors";
import * as loadingIds from "services/loadingStatus/loadingIds";
// Components
import Card from "components/Card";
import StatusIcon from "components/StatusIcon";
import SystemUpdateDetails from "./SystemUpdateDetails";
import Loading from "components/Loading";
import SubTitle from "components/SubTitle";
import { coreName } from "params";

export default function SystemUpdate() {
  const coreProgressLogs = useSelector((state: any) =>
    getProgressLogsOfDnp(state, coreName)
  );
  const isLoading = useSelector(getIsLoadingStrictById(loadingIds.coreUpdate));
  const coreUpdateAvailable = useSelector(getCoreUpdateAvailable);

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
