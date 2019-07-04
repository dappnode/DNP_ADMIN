import React from "react";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import ReadMoreMarkdown from "components/ReadMoreMarkdown";
// This
import Links from "./Links";
import Ports from "./Ports";
import Vols from "./Vols";
import StateBadge from "../StateBadge";

function Info({ dnp }) {
  if (!dnp) return null;
  const { manifest, state } = dnp;
  const { description, version, origin } = manifest || {};
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
          {version + " " + (origin || "")}
        </div>

        <div className="dnp-details-list">
          <Links dnp={dnp} />
          <Ports dnp={dnp} />
          <Vols dnp={dnp} />
        </div>
      </Card>
    </>
  );
}

export default Info;
