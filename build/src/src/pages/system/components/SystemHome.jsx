import React from "react";
import { title } from "../data";
// Components
import StaticIp from "./StaticIp";
import AutoUpdates from "./AutoUpdates";
import ChangeHostUserPassword from "./ChangeHostUserPassword";
import Title from "components/Title";

const SystemHome = () => (
  <>
    <Title title={title} />

    <ChangeHostUserPassword />

    <AutoUpdates />

    <StaticIp />
  </>
);

export default SystemHome;
