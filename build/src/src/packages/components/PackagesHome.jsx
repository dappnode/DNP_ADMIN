import React from "react";
import { NAME } from "../constants";
// Components
import PackageList from "./PackageList";

const PackagesHome = () => (
  <React.Fragment>
    <div className="section-title" style={{ textTransform: "capitalize" }}>
      {NAME}
    </div>
    <PackageList moduleName={NAME} coreDnps={false} />
  </React.Fragment>
);

export default PackagesHome;
