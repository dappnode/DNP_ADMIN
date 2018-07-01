import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import * as selector from "../selectors";
import { createStructuredSelector } from "reselect";
import modules from "../modules";

const Ethchain = modules.Ethchain;

const chainsDefault = [
  {
    id: "Mainnet",
    url: "ws://my.ethchain.dnp.dappnode.eth:8546"
  }
];
const chains = [
  ...chainsDefault,
  {
    id: "Kovan",
    url: "ws://my.kovan.dnp.dappnode.eth:8546"
  }
];
let chainInstances = [];

class Status extends React.Component {
  componentWillMount() {
    for (const chain of chains) {
      chainInstances.push(
        new Ethchain(chain.url, this.wrapUpdate(chain.id).bind(this))
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
    for (const chain of chainInstances) {
      chain.stop();
    }
    chainInstances = [];
  }
  wrapUpdate(id) {
    return res => this.props.updateStatus(id, res);
  }
  render() {
    return null;
  }
}

const mapStateToProps = createStructuredSelector({});

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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
