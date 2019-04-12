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

  if (!Object.keys(request || {}).length) return "Empty request";

  const { dnps, error } = request || {};
  const installedPackages = [];

  if (error) {
    return <Ok ok={false} msg={`DNP is not compatible: ${error}`} />;
  } else {
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
  }
}

Dependencies.propTypes = {
  request: PropTypes.shape({
    dnps: PropTypes.object.isRequired,
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
