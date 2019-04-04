import React from "react";
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

  const { success, alreadyUpdated, errors } = request || {};
  const installedPackages = [];

  if (success) {
    const dnps2 = { ...(alreadyUpdated || {}), ...(success || {}) };
    const dnps = Object.entries(dnps2).map(([dnpName, version]) => {
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
        <Ok ok={true} msg={"DNP is compatible with current DNPs"} />
        <DependencyList deps={dnps} />
      </>
    );
  }

  if (errors) {
    return <Ok ok={false} msg={"Install request not compatible"} />;
  }

  return (
    <Ok
      ok={false}
      msg={"Something went wrong, request = " + JSON.stringify(request)}
    />
  );
}

export default props => (
  <>
    <SubTitle>Dependencies</SubTitle>
    <CardList>
      <Dependencies {...props} />
    </CardList>
  </>
);
