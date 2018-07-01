import React from "react";
import parseType from "utils/parseType";

export default class DashboardInterface extends React.Component {
  render() {
    let chainIds = Object.keys(this.props.chains);
    const chainsStatus = chainIds.map((id, i) => {
      let e = this.props.chains[id];
      let type = parseType(e.status);
      // Only display inner borders, by removing all external borders
      let style = { borderLeftWidth: "0", borderRightWidth: "0" };
      if (i === 0) style.borderTopWidth = "0";
      if (i === chainIds.length - 1) style.borderBottomWidth = "0";
      return (
        <li key={i} className={"list-group-item text-" + type} style={style}>
          <strong>{id + ": "}</strong>
          {e.msg}
        </li>
      );
    });

    let statusIds = Object.keys(this.props.status);
    const dappnodeStatus = statusIds.map((id, i) => {
      let e = this.props.status[id];
      let type = parseType(e.status);
      // Only display inner borders, by removing all external borders
      let style = { borderLeftWidth: "0", borderRightWidth: "0" };
      if (i === 0) style.borderTopWidth = "0";
      if (i === statusIds.length - 1) style.borderBottomWidth = "0";
      return (
        <li key={i} className={"list-group-item text-" + type} style={style}>
          <strong>{id + ": "}</strong>
          {e.msg}
        </li>
      );
    });

    return (
      <div>
        <h1>Dashboard</h1>

        <div className="card mb-4">
          <div className="card-header">Chains status</div>
          <div className="card-body" style={{ padding: "0px" }}>
            <div className="table-responsive">
              <ul className="list-group">{chainsStatus}</ul>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">DAppNode packages status</div>
          <div className="card-body" style={{ padding: "0px" }}>
            <div className="table-responsive">
              <ul className="list-group">{dappnodeStatus}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
