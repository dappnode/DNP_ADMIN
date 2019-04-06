import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";

function IsSyncing({ message }) {
  return (
    <React.Fragment>
      <SubTitle>Mainnet is syncing...</SubTitle>
      <Card>
        <p>
          Please wait while your mainnet full node syncs to install DAppNode
          packages. Otherwise, you can install packages using their IPFS hash.
        </p>
        <p>{message}</p>
      </Card>
    </React.Fragment>
  );
}

IsSyncing.propTypes = {
  message: PropTypes.string.isRequired
};

export default IsSyncing;
