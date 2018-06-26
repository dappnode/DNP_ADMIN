import React from "react";
import InstallerModal from "../containers/InstallerModal";
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
import ChainStatusLog from "./ChainStatusLog";
import LogProgress from "./LogProgress";
import AppStore from "stores/AppStore";
import PropTypes from "prop-types";

class InstallerView extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus()
    };
    // this.updateChainStatus = this.updateChainStatus.bind(this);
  }

  static propTypes = {
    // State -> props
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.array.isRequired,
    inputValue: PropTypes.string.isRequired,
    isInitialazing: PropTypes.bool.isRequired,
    // Dispatch -> props
    fetchDirectory: PropTypes.func.isRequired,
    openModalFor: PropTypes.func.isRequired,
    updateInput: PropTypes.func.isRequired,
    updateSelectedTypes: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchDirectory();
  }

  handleAddPackage() {
    this.preInstallPackage(this.state.packageLink);
    // session.'vpn.dappnode.addPackage'
  }

  preInstallPackage(targetPackageName) {
    this.props.openModalFor(targetPackageName);
  }

  render() {
    const modalId = "exampleModal";
    const modalTarget = "#" + modalId;

    const chainStatus = this.state.chainStatus || {};

    return (
      <div>
        <div className="page-header" id="top">
          <h1>Package installer</h1>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter package's name or IPFS hash"
            aria-label="Package name"
            aria-describedby="basic-addon2"
            value={this.props.inputValue}
            onChange={this.props.updateInput}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.handleAddPackage.bind(this)}
              data-toggle="modal"
              data-target={modalTarget}
            >
              Install
            </button>
          </div>
        </div>

        <TypeFilter
          directory={this.props.directory}
          selectedTypes={this.props.selectedTypes}
          updateSelectedTypes={this.props.updateSelectedTypes}
        />

        <ChainStatusLog />

        <LogProgress progressLog={this.state.progressLog} />

        <PackageStore
          directory={this.props.directory}
          isSyncing={chainStatus.isSyncing}
          isInitialazing={this.props.isInitialazing}
          preInstallPackage={this.preInstallPackage.bind(this)}
          modalTarget={modalTarget}
        />

        <InstallerModal modalId={modalId} />
      </div>
    );
  }
}

export default InstallerView;
