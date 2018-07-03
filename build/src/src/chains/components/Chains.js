import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import eventBus from "eventBus";
// modules
import packages from "packages";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class Status extends React.Component {
  componentWillMount() {
    // Init mainnet right away
    this.props.initMainnet();
    // Fetch packages
    token = eventBus.subscribe("connection_open", this.props.init);
    if (isOpen()) this.props.init();
  }
  componentWillUnmount() {
    // Clean out subscriptions
    eventBus.unsubscribe(token);
    // Stop chain watchers
    this.props.stopChainWatchers();
  }

  render() {
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
    init: () => {
      dispatch(action.init());
    },
    initMainnet: () => {
      dispatch(action.initMainnet());
    },
    stopChainWatchers: () => {
      dispatch(action.stopChainWatchers());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
