import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
// This module
import InstallDnpView from "./InstallDnpView";
import * as a from "../actions";
// Utils
import { shortNameCapitalized } from "utils/format";
import {
  getDnpRequest,
  getDnpRequestStatus
} from "services/dnpRequest/selectors";
import { fetchDnpRequest } from "services/dnpRequest/actions";
import Title from "components/Title";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import { RequestedDnp, RequestStatus } from "types";
import {
  getProgressLogsByDnp,
  getIsInstallingLogs
} from "services/isInstallingLogs/selectors";

function getIdFromMatch(match?: { params: { id: string } }) {
  return decodeURIComponent(((match || {}).params || {}).id || "");
}

interface IsInstallingLogs {
  [progressLogId: string]: {
    [dnpName: string]: string;
  };
}

function getProgressLogs(isInstallingLogs: IsInstallingLogs, dnpName: string) {
  const progressLogId = Object.keys(isInstallingLogs).find(
    id => (isInstallingLogs[id] || {})[dnpName]
  );
  if (progressLogId) return isInstallingLogs[progressLogId];
}

interface InstallDnpContainerProps {
  id: string;
  dnp?: RequestedDnp;
  requestStatus?: RequestStatus;
  isInstallingLogs?: any;
  progressLogs: { [dnpName: string]: string };
  install: (x: any) => void;
  clearUserSet: () => void;
  fetchDnpRequest: (id: string) => void;
}

interface InstallerRouteParams {
  id: string;
}

const InstallDnpContainer: React.FunctionComponent<
  InstallDnpContainerProps & RouteComponentProps<InstallerRouteParams>
> = ({
  dnp,
  match,
  requestStatus,
  isInstallingLogs,
  // Actions
  fetchDnpRequest
}) => {
  console.log(isInstallingLogs);

  const id = getIdFromMatch(match);

  const { loading, error } = requestStatus || {};

  useEffect(() => {
    fetchDnpRequest(id);
  }, [id, fetchDnpRequest]);

  const progressLogs =
    dnp && dnp.name ? getProgressLogs(isInstallingLogs, dnp.name) : undefined;

  // Get progressLogs

  return (
    <>
      <Title
        title="Installer"
        subtitle={dnp && dnp.name ? shortNameCapitalized(dnp.name) : id}
      />

      {dnp ? (
        <InstallDnpView dnp={dnp} progressLogs={progressLogs} />
      ) : loading ? (
        <Loading msg={"Loading DAppNode Package data..."} />
      ) : error ? (
        <Error msg={error} />
      ) : null}
    </>
  );
};

// Container

const mapStateToProps = createStructuredSelector({
  dnp: (state: any, ownProps: any) =>
    getDnpRequest(state, getIdFromMatch(ownProps.match)),
  requestStatus: (state: any, ownProps: any) =>
    getDnpRequestStatus(state, getIdFromMatch(ownProps.match)),
  isInstallingLogs: getIsInstallingLogs
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchDnpRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallDnpContainer);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
