import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
// This page
import * as a from "../actions";
import * as s from "../selectors";
import * as utils from "../utils";
import { rootPath } from "../data";
// Components
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
// Styles
import "./installer.css";
// Utils
import onEnterKey from "utils/onEnterKey";

class InstallerHome extends React.Component {
  static propTypes = {
    // State -> props
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    // Dispatch -> props
    openPackage: PropTypes.func.isRequired,
    updateInput: PropTypes.func.isRequired,
    updateSelectedTypes: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <div className="section-title">Installer</div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter package's name or IPFS hash"
            value={this.props.inputValue}
            onChange={this.props.updateInput}
            onKeyDown={onEnterKey(
              this.props.openPackage,
              this.props.inputValue
            )}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => this.props.openPackage(this.props.inputValue)}
            >
              Search
            </button>
          </div>
        </div>

        <TypeFilter
          directory={this.props.directory}
          selectedTypes={this.props.selectedTypes}
          updateSelectedTypes={this.props.updateSelectedTypes}
        />

        <PackageStore
          directory={this.props.directory}
          directoryLoaded={this.props.directoryLoaded}
          openPackage={this.props.openPackage}
          isSyncing={this.props.isSyncing}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  directory: s.getFilteredDirectoryWithTagsNonCores,
  directoryLoaded: s.directoryLoaded,
  selectedTypes: s.getSelectedTypes,
  inputValue: s.getInputValue,
  isSyncing: s.isSyncing
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPackage: id => {
      ownProps.history.push(rootPath + "/" + encodeURIComponent(id));
      // Dispatch a fetch anyway
      dispatch(a.fetchPackageData(id));
      // Empty the input bar
      dispatch(a.updateInput(""));
    },
    updateInput: e => {
      // Correct the ipfs format and fecth if correct
      const id = utils.correctPackageName(e.target.value);
      // If the packageLink is a valid IPFS hash preload it's info
      if (utils.isIpfsHash(id)) {
        dispatch(a.fetchPackageData(id));
      }
      if (utils.isDnpDomain(id)) {
        dispatch(a.fetchPackageData(id));
      }
      // Update input field
      dispatch(a.updateInput(id));
    },
    updateSelectedTypes: types => {
      dispatch(a.updateSelectedTypes(types));
    }
  };
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InstallerHome);
