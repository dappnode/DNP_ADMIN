import React from "react";
import ReactMarkdown from "react-markdown";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import ReadMore from "components/ReadMore";
// This
import Links from "./Links";
import Ports from "./Ports";
import Vols from "./Vols";
import StateBadge from "../StateBadge";

function PackageDetails({ dnp }) {
  if (!dnp) return null;
  const { manifest, state } = dnp;
  const { description, version, origin } = manifest || {};
  return (
    <>
      <SubTitle>Stats</SubTitle>
      <Card>
        <div>
          <strong>Status: </strong>
          <StateBadge state={state} />
        </div>

        <ReadMore>
          <header>
            <strong>Description</strong>
          </header>
          <ReactMarkdown className="no-p-style" source={description} />
        </ReadMore>

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

export default PackageDetails;
