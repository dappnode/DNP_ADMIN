import React from "react";

export default class ChainStatusLog extends React.Component {
  render() {
    // ChainStatus
    const chainStatus = this.props.chainStatus || {};

    if (chainStatus.type === "warning") {
      return (
        <div className={"alert alert-" + chainStatus.type} role="alert">
          <h4 className="alert-heading">Mainnet is still syncing</h4>
          <p>
            Until complete syncronization you will not be able to navigate to
            decentralized websites or install packages via .eth names.
          </p>
          <p>Status: {chainStatus.status}</p>
        </div>
      );
    } else if (chainStatus.type === "danger") {
      return (
        <div className={"alert alert-" + chainStatus.type} role="alert">
          <h4 className="alert-heading">Unable to connect to Mainnet</h4>
          <p>
            Until connected to DAppNode ethereum chain you will not be able to
            navigate to decentralized websites or install packages via .eth
            names.
          </p>
          <p>{chainStatus.status}</p>
        </div>
      );
    } else {
      // If chain is fully synced don't diplay anything
      return null;
    }
  }
}
