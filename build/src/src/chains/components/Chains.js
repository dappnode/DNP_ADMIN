import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import modules from "../modules";
import eventBus from "eventBus";
// modules
import packages from "packages";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

const Ethchain = modules.Ethchain;

const chainsDefault = [
  {
    id: "Mainnet",
    url: "ws://my.ethchain.dnp.dappnode.eth:8546"
  }
];

let chains;

let ethchains = [
  {
    id: "Kovan",
    name: "kovan.dnp.dappnode.eth",
    url: "ws://my.kovan.dnp.dappnode.eth:8546"
  },
  {
    id: "Ropsten",
    name: "ropsten.dnp.dappnode.eth",
    url: "ws://my.ropsten.dnp.dappnode.eth:8546"
  },
  {
    id: "Rinkeby",
    name: "rinkeby.dnp.dappnode.eth",
    url: "ws://my.rinkeby.dnp.dappnode.eth:8546"
  }
];

class Status extends React.Component {
  componentWillMount() {
    // Fetch packages
    token = eventBus.subscribe("connection_open", this.props.fetchPackages);
    if (isOpen()) this.props.fetchPackages();
    // Launch chain watchers
    chains = [...chainsDefault];
    for (const chain of chains) {
      chain.instance = new Ethchain(
        chain.url,
        this.wrapUpdate(chain.id).bind(this)
      );
    }
    // this.props.init();
    // this.props.check();
  }
  componentDidMount() {
    // const interval = setInterval(() => {
    //   this.props.check();
    // }, 5 * 1000);
    // this.setState({ interval });
  }
  componentWillUnmount() {
    // Clean out subscriptions
    eventBus.unsubscribe(token);
    // Stop chain watchers
    for (const chain of chains) {
      chain.instance.stop();
    }
    chains = [];
  }
  wrapUpdate(id) {
    return res => this.props.updateStatus(id, res);
  }
  render() {
    console.log();
    // Add news
    let handleChainAdd = pkg => {
      const chain = ethchains.find(chain => chain.name === pkg.name);
      if (chain) {
        chains.push({
          ...chain,
          instance: new Ethchain(
            chain.url,
            this.wrapUpdate(chain.id).bind(this)
          )
        });
      }
    };
    handleChainAdd = handleChainAdd.bind(this);
    this.props.packageList
      .filter(pkg => !chains.find(chain => chain.name === pkg.name))
      .forEach(handleChainAdd);

    // This code cause problems and is labeled as an antipattern
    // // Remove old
    // chains = chains.filter(chain => {
    //   let _chain = this.props.packageList.find(pkg => chain.name === pkg.name);
    //   // Remove chain if is not found in the package list
    //   if (!_chain) {
    //     this.props.removeChain(chain.id);
    //     chain.instance.stop();
    //   }
    //   return _chain;
    // });

    return null;
  }
}

const mapStateToProps = createStructuredSelector({
  packageList: packages.selectors.getDnpPackages
});

const mapDispatchToProps = dispatch => {
  return {
    check: () => {
      // dispatch(action.check());
    },
    init: () => {
      dispatch(action.init());
    },
    updateStatus: (id, res) => {
      dispatch(action.updateStatus(id, res));
    },
    removeChain: id => {
      dispatch(action.removeChain(id));
    },
    fetchPackages: () => {
      dispatch(packages.actions.listPackages());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
