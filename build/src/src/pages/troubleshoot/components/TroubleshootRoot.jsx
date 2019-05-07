import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import TroubleshootHome from "./TroubleshootHome";
// Logic

const TroubleshootRoot = () => (
  <>
    <Route exact path={rootPath} component={TroubleshootHome} />
    <Route path={rootPath + "/:id"} component={null} />
  </>
);

export default TroubleshootRoot;
