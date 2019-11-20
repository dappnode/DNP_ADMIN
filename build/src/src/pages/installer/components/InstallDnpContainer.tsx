import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
// This module
import InstallDnpView from "./InstallDnpView";
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
import { RequestedDnp, RequestStatus, ProgressLogsByDnp } from "types";
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";

function getIdFromMatch(match?: { params: { id: string } }) {
  return decodeURIComponent(((match || {}).params || {}).id || "");
}

interface InstallDnpContainerProps {
  id: string;
  dnp?: RequestedDnp;
  requestStatus?: RequestStatus;
  progressLogsByDnp: ProgressLogsByDnp;
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
  progressLogsByDnp,
  // Actions
  fetchDnpRequest
}) => {
  const id = getIdFromMatch(match);

  const { loading, error, success } = requestStatus || {};

  useEffect(() => {
    fetchDnpRequest(id);
  }, [id, fetchDnpRequest]);

  // Get progressLogs
  const progressLogs =
    dnp && dnp.name ? progressLogsByDnp[dnp.name] : undefined;

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
      ) : success ? (
        <Error msg={"Package loaded but is not found"} />
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
  progressLogsByDnp: getProgressLogsByDnp
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchDnpRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallDnpContainer);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
