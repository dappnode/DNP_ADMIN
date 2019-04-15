import React from "react";
import PropTypes from "prop-types";
// Components
import CardList from "components/CardList";
import SubTitle from "components/SubTitle";
import Ok from "components/Ok";
import DependencyList from "./DependencyList";
import ProgressBar from "react-bootstrap/ProgressBar";

function Dependencies({ request, resolving }) {
  if (resolving)
    return (
      <div>
        <ProgressBar now={100} animated={true} label={"Resolving..."} />
      </div>
    );

  const { dnps, error } = request || {};
  const installedPackages = [];

  if (error) {
    return <Ok ok={false} msg={`DNP is not compatible: ${error}`} />;
  } else if (dnps) {
    return (
      <>
        <Ok ok={true} msg={`DNP is compatible`} />
        <DependencyList
          deps={Object.entries(dnps).map(([dnpName, version]) => {
            const dnp = installedPackages.find(dnp => dnp.name === dnpName);
            return {
              from: (dnp || {}).version || "",
              to: version,
              name: dnpName,
              manifest: {}
            };
          })}
        />
      </>
    );
  } else {
    return <Ok ok={false} msg={`Request in unkown state`} />;
  }
}

Dependencies.propTypes = {
  request: PropTypes.shape({
    dnps: PropTypes.object,
    error: PropTypes.string
  }).isRequired,
  resolving: PropTypes.bool.isRequired
};

export default props => (
  <>
    <SubTitle>Dependencies</SubTitle>
    <CardList>
      <Dependencies {...props} />
    </CardList>
  </>
);
