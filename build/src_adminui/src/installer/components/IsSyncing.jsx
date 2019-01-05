import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// Styles
import "./installer.css";

class InstallerView extends React.Component {
  static propTypes = {
    mainnet: PropTypes.object.isRequired
  };

  render() {
    const margin = "5px";
    const padding = "0.7rem";

    return (
      <React.Fragment>
        <div className="section-subtitle">Mainnet is syncing...</div>
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="row">
              <div className="col" style={{ margin, overflow: "hidden" }}>
                <p>
                  Please wait while your mainnet full node syncs to install
                  DAppNode packages. Otherwise, you can install packages using
                  their IPFS hash. Thank you for your patience and to
                  decentralize the network.
                </p>
                <p>{this.props.mainnet.msg}</p>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  mainnet: state => {
    const mainnet = state.chainData.find(
      chain => (chain.name || "").toLowerCase() === "mainnet"
    );
    return mainnet || {};
  }
});

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerView);
