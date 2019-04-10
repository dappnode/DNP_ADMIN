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

  const { success, alreadyUpdated, message } = request || {};
  const installedPackages = [];

  if (success) {
    const dnps = Object.entries({
      ...(alreadyUpdated || {}),
      ...(success || {})
    }).map(([dnpName, version]) => {
      const dnp = installedPackages.find(dnp => dnp.name === dnpName);
      return {
        from: (dnp || {}).version || "",
        to: version,
        name: dnpName,
        manifest: {}
      };
    });
    return (
      <>
        <Ok ok={true} msg={`DNP is compatible: ${message}`} />
        <DependencyList deps={dnps} />
      </>
    );
  } else {
    return <Ok ok={false} msg={`DNP is not compatible: ${message}`} />;
  }
}

Dependencies.propTypes = {
  request: PropTypes.shape({
    success: PropTypes.any.isRequired,
    alreadyUpdated: PropTypes.object,
    message: PropTypes.string.isRequired
  }),
  resolving: PropTypes.bool
};

export default props => (
  <>
    <SubTitle>Dependencies</SubTitle>
    <CardList>
      <Dependencies {...props} />
    </CardList>
  </>
);
