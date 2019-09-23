import React from "react";
import { Route } from "react-router-dom";
// Components
import Publish from "./Publish";
import Explore from "./Explore";
import SdkHome from "./SdkHome";

import "./sdk.css";

const SdkRoot = ({ match }) => (
  <>
    <Route exact path={match.path} component={SdkHome} />
    <Route path={match.path + "/publish/:urlQuery?"} component={Publish} />
    <Route path={match.path + "/explore"} component={Explore} />
  </>
);

export default SdkRoot;
