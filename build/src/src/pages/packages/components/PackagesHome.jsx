import React from "react";
import { title } from "../data";
// Components
import PackageList from "./PackageList";
import Title from "components/Title";

const PackagesHome = () => (
  <>
    <Title>{title}</Title>
    <PackageList moduleName={title} coreDnps={false} />
  </>
);

export default PackagesHome;
