import React from "react";
import PropTypes from "prop-types";
import eventBus from "eventBus";
// Components
import InstallerModal from "../containers/InstallerModal";
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
// Modules
import status from "status";
import chains from "chains";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class InstallerView extends React.Component {
  static propTypes = {
    // State -> props
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.array.isRequired,
    inputValue: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    // Dispatch -> props
    fetchDirectory: PropTypes.func.isRequired,
    openModalFor: PropTypes.func.isRequired,
    updateInput: PropTypes.func.isRequired,
    updateSelectedTypes: PropTypes.func.isRequired
  };

  componentWillMount() {
    token = eventBus.subscribe("connection_open", this.props.fetchDirectory);
    if (isOpen()) this.props.fetchDirectory();
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

  render() {
    const modalId = "exampleModal";
    const modalTarget = "#" + modalId;

    return (
      <div>
        <status.components.DependenciesAlert
          deps={["wamp", "dappmanager", "ipfs", "mainnet", "upnp"]}
        />
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
              onClick={this.props.openModalFor}
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

        <chains.components.ChainStatusLog />

        <PackageStore
          directory={this.props.directory}
          fetching={this.props.fetching}
          preInstallPackage={this.props.openModalFor}
          modalTarget={modalTarget}
        />

        <InstallerModal modalId={modalId} />
      </div>
    );
  }
}

export default InstallerView;
