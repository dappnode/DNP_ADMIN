import React from "react";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import ReadMoreMarkdown from "components/ReadMoreMarkdown";
// This
import Links from "./Links";
import Vols from "./Vols";
import StateBadge from "../StateBadge";
import "./info.scss";

function Info({ dnp }) {
  if (!dnp) return null;
  const { manifest, state } = dnp;
  const { description, version, upstreamVersion, origin } = manifest || {};
  return (
    <>
      <SubTitle>Details</SubTitle>
      <Card>
        <div>
          <strong>Status: </strong>
          <StateBadge state={state} />
        </div>

        <header>
          <strong>Description</strong>
        </header>
        <ReadMoreMarkdown source={description} />

        <div>
          <strong>Version: </strong>
          {version} {upstreamVersion && `(${upstreamVersion} upstream)`}{" "}
          {origin || ""}
        </div>

        <div>
          <Vols dnp={dnp} />
        </div>

        <div>
          <Links dnp={dnp} />
        </div>
      </Card>
    </>
  );
}

export default Info;
