import React from "react";
import { Route } from "react-router-dom";
// Components
import DeviceDetails from "./DeviceDetails";
import DevicesHome from "./DevicesHome";
import withLoading from "components/hoc/withLoading";
// General styles
import "./devices.css";

const DevicesRoot = ({ match }) => (
  <>
    <Route exact path={match.path} component={DevicesHome} />
    <Route path={match.path + "/:id"} component={DeviceDetails} />
  </>
);

// Use `compose` from "redux" if you need multiple HOC
export default withLoading("devices")(DevicesRoot);
