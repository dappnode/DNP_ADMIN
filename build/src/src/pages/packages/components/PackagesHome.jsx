import React from "react";
import { title } from "../data";
// Components
import PackageList from "./PackageList";

const PackagesHome = () => (
  <React.Fragment>
    <div className="section-title">{title}</div>
    <PackageList moduleName={title} coreDnps={false} />
  </React.Fragment>
);

export default PackagesHome;
