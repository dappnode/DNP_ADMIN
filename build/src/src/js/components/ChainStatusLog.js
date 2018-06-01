import React from 'react'
import AppStore from 'Store'

export default class ChainStatusLog extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus()
    }
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
      chainStatus: AppStore.getChainStatus()
    });
  }

  render() {
    // ChainStatus
    const chainStatus = this.state.chainStatus.Mainnet || {}

    if (chainStatus.type == 'warning') {
      return (
        <div className={"alert alert-"+chainStatus.type} role="alert">
          <h4 className="alert-heading">{chainStatus.name} is still syncing</h4>
          <p>Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names.</p>
          <p>Status: {chainStatus.status}</p>
        </div>
      )

    } else if (chainStatus.type == 'danger') {
      return (
        <div className={"alert alert-"+chainStatus.type} role="alert">
          <h4 className="alert-heading">Unable to connect to {chainStatus.name}</h4>
          <p>Until connected to DAppNode ethereum chain you will not be able to navigate to decentralized websites or install packages via .eth names.</p>
          <p>{chainStatus.status}</p>
        </div>
      )

    } else {
      // If chain is fully synced don't diplay anything
      return null
    }
  }

}
