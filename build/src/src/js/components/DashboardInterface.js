import React from 'react'
import * as VPNcall from './API/crossbarCalls'
import AppStore from 'Store'

// let api = new Api(new Parity.Api.Transport.Http('http://my.ethchain.dnp.dappnode.eth:8545'))

// ws://my.ethchain.dnp.dappnode.eth:8546

export default class DashboardInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus()
    };
    this.updateChainStatus = this.updateChainStatus.bind(this)
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
  }
  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
  }
  updateChainStatus() {
    this.setState({
      deviceList: AppStore.getChainStatus()
    });
  }

  render() {

    let type = this.state.chainStatus.type || 'default'
    let status = this.state.chainStatus.status

    return (
      <div>
        <h1>Dashboard</h1>
        <div class="card">
          <div class="card-header">Chain status</div>
          <div class="card-body">
            <h5 class="card-title">Mainnet</h5>
            <p class={"card-text text-"+type}>{status}</p>
          </div>
        </div>
      </div>
    );
  }
}
