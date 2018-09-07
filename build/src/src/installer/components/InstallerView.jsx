import React from "react";
import PropTypes from "prop-types";
// Components
import InstallerModal from "../containers/InstallerModal";
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
// Modules
import chains from "chains";
// Styles
import "./installer.css";

class InstallerView extends React.Component {
  static propTypes = {
    // State -> props
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.array.isRequired,
    inputValue: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    // Dispatch -> props
    openPackage: PropTypes.func.isRequired,
    updateInput: PropTypes.func.isRequired,
    updateSelectedTypes: PropTypes.func.isRequired
  };

  render() {
    const modalId = "exampleModal";
    const modalTarget = "#" + modalId;

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
            onKeyDown={e => {
              const key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
              if (key === 13) this.props.openPackage(this.props.inputValue);
            }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => this.props.openPackage(this.props.inputValue)}
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
          openPackage={this.props.openPackage}
          modalTarget={modalTarget}
        />

        <InstallerModal modalId={modalId} />
      </div>
    );
  }
}

export default InstallerView;
