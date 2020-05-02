import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { title } from "../data";
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
import Loading from "components/Loading";
import Error from "components/Error";
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";

const InstallDnpContainer: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const id = decodeURIComponent(match.params.id);
  const dnp = useSelector((state: any) => getDnpRequest(state, id));
  const requestStatus = useSelector((state: any) =>
    getDnpRequestStatus(state, id)
  );
  const progressLogsByDnp = useSelector(getProgressLogsByDnp);
  const dispatch = useDispatch();

  const { loading, error, success } = requestStatus || {};

  useEffect(() => {
    dispatch(fetchDnpRequest(id));
  }, [id, dispatch]);

  // Get progressLogs
  const progressLogs =
    dnp && dnp.name ? progressLogsByDnp[dnp.name] : undefined;

  return (
    <>
      <Title
        title={title}
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

export default InstallDnpContainer;
