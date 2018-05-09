import React from 'react'
import * as VPNcall from './API/crossbarCalls'
import PackageList from './PackageList'
import LogMessage from './LogMessage'
import AppStore from 'Store'
import Api from '@parity/api'
import Web3 from 'Lib/web3.min'

// let api = new Api(new Parity.Api.Transport.Http('http://my.ethchain.dnp.dappnode.eth:8545'))

// ws://my.ethchain.dnp.dappnode.eth:8546

export default class PackageInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      inputValue: 'ws://my.ethchain.dnp.dappnode.eth:8546',
      stateMessage: '',
      errorMsg: ''
    };
    this.handleSync = this.handleSync.bind(this);
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updatePackageList.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updatePackageList.bind(this));
  }

  handleLaunchWeb3() {
    let web3 = new Web3(new Web3.providers.WebsocketProvider(this.state.inputValue));
    let _this = this;
    setInterval(function(){
      web3.eth.isSyncing()
      .then(_this.handleSync);
    }, 500);
  }
  handleSync(isSyncing) {
    let stateMessage;
    if (isSyncing) {
      stateMessage = 'Blocks synced: '+isSyncing.currentBlock+' / '+isSyncing.highestBlock
    } else {
      stateMessage = 'Fully syncronized'
    }
    this.setState({ stateMessage });
  }
  handleReloadPackageList() {
    VPNcall.listPackages();
  }

  removePackageInTable(e) {
    VPNcall.removePackage(e.currentTarget.id);
  }

  updateInputValue(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  updatePackageId(e) {
    this.setState({
      packageId: e.target.value
    });
  }

  updatePackageList() {
    this.setState({
      packageList: AppStore.getPackageList()
    });
  }

  render() {
    return (
      <div>
        <h1>Status</h1>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Parity WebSocket provider" aria-label="Parity WebSocket provider" aria-describedby="basic-addon2"
            value={this.state.inputValue}
            onChange={this.updateInputValue.bind(this)}
          ></input>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button"
              onClick={this.handleLaunchWeb3.bind(this)}
            >Launch web3 synching</button>
          </div>
        </div>

        <div class="alert alert-secondary" role="alert">
          {this.state.stateMessage}
        </div>
      </div>
    );
  }
}
