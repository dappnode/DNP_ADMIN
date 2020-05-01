import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
// Components
import DeviceDetails from "./DeviceDetails";
import DevicesHome from "./DevicesHome";
// General styles
import "./devices.css";
import { useSelector } from "react-redux";
import Loading from "components/Loading";
import { getIsLoading } from "services/loadingStatus/selectors";

export const DevicesRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const loading = useSelector(getIsLoading.devices);

  if (loading) return <Loading msg={`Loading devices...`} />;
  else
    return (
      <>
        <Route exact path={match.path} component={DevicesHome} />
        <Route path={match.path + "/:id"} component={DeviceDetails} />
      </>
    );
};
