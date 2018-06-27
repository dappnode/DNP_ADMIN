import React from "react";
import AppStore from "stores/AppStore";

// let api = new Api(new Parity.Api.Transport.Http('http://my.ethchain.dnp.dappnode.eth:8545'))

// ws://my.ethchain.dnp.dappnode.eth:8546

export default class DashboardInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus(),
      status: AppStore.getStatus(),
      interval: null
    };
    this.updateChainStatus = this.updateChainStatus.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }
  componentWillMount() {
    this.props.init();
    this.props.check();
  }
  componentDidMount() {
    const interval = setInterval(() => {
      this.props.check();
    }, 2000);
    this.setState({ interval });
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
    AppStore.on(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
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

    const dappnodeStatus = this.props.items.map((e, i) => {
      let type;
      if (e.status === 1) type = "success";
      if (e.status === 0) type = "warning";
      if (e.status === -1) type = "danger";
      // Only display inner borders, by removing all external borders
      let style = { borderLeftWidth: "0", borderRightWidth: "0" };
      if (i === 0) style.borderTopWidth = "0";
      if (i === this.props.items.length - 1) style.borderBottomWidth = "0";
      return (
        <li key={i} className={"list-group-item text-" + type} style={style}>
          <strong>{e.id + ": "}</strong>
          {e.msg}
        </li>
      );
    });

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
