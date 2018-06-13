import React from "react";
import AppStore from "stores/AppStore";

// let api = new Api(new Parity.Api.Transport.Http('http://my.ethchain.dnp.dappnode.eth:8545'))

// ws://my.ethchain.dnp.dappnode.eth:8546

export default class DashboardInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus(),
      status: AppStore.getStatus()
    };
    this.updateChainStatus = this.updateChainStatus.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
    AppStore.on(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  componentWillUnmount() {
    AppStore.removeListener(
      AppStore.tag.CHANGE_CHAINSTATUS,
      this.updateChainStatus
    );
    AppStore.removeListener(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  updateChainStatus() {
    this.setState({
      chainStatus: AppStore.getChainStatus()
    });
  }
  updateStatus() {
    this.setState({
      status: AppStore.getStatus()
    });
  }

  render() {
    let type = this.state.chainStatus.type || "default";
    let status = this.state.chainStatus.status;

    const dappnodeStatus = Object.getOwnPropertyNames(this.state.status).map(
      (pkg, i) => {
        const tdItems = Object.getOwnPropertyNames(this.state.status[pkg]).map(
          (item, j) => {
            let type;
            let typeNum = this.state.status[pkg][item].on;
            if (typeNum === 1) type = "success";
            if (typeNum === 0) type = "warning";
            if (typeNum === -1) type = "danger";
            return (
              <td key={j} className={"text-" + type}>
                <strong>{item}:</strong> {this.state.status[pkg][item].msg}
              </td>
            );
          }
        );

        return (
          <tr key={i}>
            <th scope="row">{pkg}</th>
            {tdItems}
          </tr>
        );
      }
    );

    return (
      <div>
        <h1>Dashboard</h1>
        <div className="card mb-4">
          <div className="card-header">Chain status</div>
          <div className="card-body">
            <h5 className="card-title">Mainnet</h5>
            <p className={"card-text text-" + type}>{status}</p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">DAppNode packages status</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <tbody>{dappnodeStatus}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
