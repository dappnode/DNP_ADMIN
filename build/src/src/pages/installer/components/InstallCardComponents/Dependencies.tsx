import React from "react";
import PropTypes from "prop-types";
// Components
import CardList from "components/CardList";
import SubTitle from "components/SubTitle";
import Ok from "components/Ok";
import DependencyList from "./DependencyList";
import ProgressBar from "react-bootstrap/ProgressBar";

interface DependenciesProps {
  noCard?: boolean;
  resolving: boolean;
  error: string | undefined;
  dnps: {
    [dnpName: string]: { from: string | null; to: string };
    // "bitcoin.dnp.dappnode.eth": { from: "0.2.5"; to: "0.2.6" };
    // "ln.dnp.dappnode.eth": { from: null; to: "0.2.2" };
  };
}

const Dependencies: React.FunctionComponent<DependenciesProps> = ({
  noCard,
  resolving,
  error,
  dnps
}) => {
  const body = resolving ? (
    <div>
      <ProgressBar now={100} animated={true} label={"Resolving..."} />
    </div>
  ) : error ? (
    <Ok ok={false} msg={`DAppNode Package is not compatible: ${error}`} />
  ) : dnps ? (
    <>
      <Ok ok={true} msg={`DAppNode Package is compatible`} />
      <div style={{ marginTop: 12, marginLeft: 28 }}>
        <DependencyList
          deps={Object.entries(dnps).map(([name, { from, to }]) => {
            return { from, to, name };
          })}
        />
      </div>
    </>
  ) : (
    <Ok ok={false} msg={`Request in unkown state`} />
  );

  return noCard ? (
    body
  ) : (
    <>
      <SubTitle>Dependencies</SubTitle>
      <CardList>{body}</CardList>
    </>
  );
};

export default Dependencies;
