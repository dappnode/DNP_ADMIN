import React from 'react'
import * as VPNcall from './API/crossbarCalls'
import PackageList from './PackageList'
import LogMessage from './LogMessage'
import AppStore from 'Store'
import Api from '@parity/api'
import Web3 from 'Lib/web3.min'

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
    let ethchainNames = Object.getOwnPropertyNames(this.state.chainStatus)
    let listItems = ethchainNames.map((ethchainName, i) => {
      let type = this.state.chainStatus[ethchainName].type || 'default'
      return (
        <div key={i} class="card">
          <div class="card-header">Chain status</div>
          <div class="card-body">
            <h5 class="card-title">{this.state.chainStatus[ethchainName].name}</h5>
            <p class={"card-text text-"+type}>{this.state.chainStatus[ethchainName].status}</p>
          </div>
        </div>
      )
    })

    return (
      <div>
        <h1>Dashboard</h1>
        {listItems}
      </div>
    );
  }
}
