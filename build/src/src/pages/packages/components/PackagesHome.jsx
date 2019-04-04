import React from "react";
import { title } from "../data";
// Components
import PackageList from "./PackageList";

const PackagesHome = () => (
  <>
    <div className="section-title">{title}</div>
    <PackageList moduleName={title} coreDnps={false} />
  </>
);

export default PackagesHome;
