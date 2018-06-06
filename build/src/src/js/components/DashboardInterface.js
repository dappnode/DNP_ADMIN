import React from 'react'
import * as VPNcall from './API/crossbarCalls'
import AppStore from 'Store'

// let api = new Api(new Parity.Api.Transport.Http('http://my.ethchain.dnp.dappnode.eth:8545'))

// ws://my.ethchain.dnp.dappnode.eth:8546

export default class DashboardInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus(),
      status: AppStore.getStatus()
    };
    this.updateChainStatus = this.updateChainStatus.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
    AppStore.on(AppStore.tag.CHANGE_STATUS, this.updateStatus);
  }
  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
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

    console.log('###### STATUS',this.state.status)

    let type = this.state.chainStatus.type || 'default'
    let status = this.state.chainStatus.status

    const dappnodeStatus = Object.getOwnPropertyNames(this.state.status).map((pkg, i) => {
      const tdItems = Object.getOwnPropertyNames(this.state.status[pkg]).map((item, j) => {
        const type = this.state.status[pkg][item].on ? 'success' : 'danger'
        const tag = this.state.status[pkg][item].on ? 'ON' : 'OFF'
        return (
          <td key={j} class={"text-"+type}>
            {item} <strong>{tag}</strong>: {this.state.status[pkg][item].msg}
          </td>
        )
      })

      return (
        <tr key={i}>
          <th scope="row">{pkg}</th>
          {tdItems}
        </tr>
      )
    })

    return (
      <div>
        <h1>Dashboard</h1>
        <div class="card mb-4">
          <div class="card-header">Chain status</div>
          <div class="card-body">
            <h5 class="card-title">Mainnet</h5>
            <p class={"card-text text-"+type}>{status}</p>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header">DAppNode packages status</div>
          <div class="card-body">
            <table class="table">
              <tbody>
                {dappnodeStatus}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }
}
