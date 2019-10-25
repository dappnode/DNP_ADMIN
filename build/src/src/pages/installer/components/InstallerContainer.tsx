import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
// This module
import InstallerInterface from "./Installer";
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
// ### Move out
import "./stepper.scss";

function getIdFromMatch(match?: { params: { id: string } }) {
  return decodeURIComponent(((match || {}).params || {}).id || "");
}

interface InstallerContainerProps {
  id: string;
  dnp?: RequestedDnp;
  requestStatus?: RequestStatus;
  progressLogs: { [dnpName: string]: string };
  install: (x: any) => void;
  clearUserSet: () => void;
  fetchDnpRequest: (id: string) => void;
}

interface InstallerRouteParams {
  id: string;
}

const InstallerContainer: React.FunctionComponent<
  InstallerContainerProps & RouteComponentProps<InstallerRouteParams>
> = ({
  dnp,
  match,
  requestStatus,
  // Actions
  fetchDnpRequest
}) => {
  const id = getIdFromMatch(match);

  const { loading, error } = requestStatus || {};

  useEffect(() => {
    fetchDnpRequest(id);
  }, [id, fetchDnpRequest]);

  return (
    <>
      <Title
        title="Installer"
        subtitle={dnp && dnp.name ? shortNameCapitalized(dnp.name) : id}
      />

      {dnp ? (
        <InstallerInterface dnp={dnp} progressLogs={{}} />
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
    getDnpRequestStatus(state, getIdFromMatch(ownProps.match))
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
)(InstallerContainer);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
