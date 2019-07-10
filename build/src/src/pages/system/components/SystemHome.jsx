import React from "react";
import { title } from "../data";
// Components
import StaticIp from "./StaticIp";
import ChangeHostUserPassword from "./ChangeHostUserPassword";
import Title from "components/Title";

const SystemHome = () => (
  <>
    <Title title={title} />

    <ChangeHostUserPassword />

    <StaticIp />
  </>
);

export default SystemHome;
