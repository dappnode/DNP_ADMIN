import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
// This page
import * as a from "../actions";
import * as s from "../selectors";
import * as utils from "../utils";
import filterDirectory from "../helpers/filterDirectory";
import { rootPath } from "../data";
import NoPackageFound from "./NoPackageFound";
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Loading from "components/generic/Loading";
// Selectors
import { getMainnet } from "services/chainData/selectors";
import { getIsLoadingById } from "services/loadingStatus/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Styles
import "./installer.css";
import IsSyncing from "./IsSyncing";

function InstallerHome({
  // variables
  directory,
  mainnet,
  isLoading,
  history,
  // Actions
  fetchPackageData
}) {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState({});

  useEffect(() => {
    // If the packageLink is a valid IPFS hash preload it's info
    if (utils.isIpfsHash(query) || utils.isDnpDomain(query))
      fetchPackageData(query);
  }, [query]);

  function openDnp(id) {
    const dnp = directory.find(({ name }) => name === id);
    if ((dnp || {}).tag === "UPDATED") {
      history.push(packagesRootPath + "/" + dnp.name);
    } else {
      fetchPackageData(id);
      history.push(rootPath + "/" + encodeURIComponent(id));
    }
  }

  function onTypeChange(type) {
    setSelectedTypes(ts => ({ ...ts, [type]: !ts[type] }));
  }

  const directoryFiltered = filterDirectory({
    directory,
    query,
    selectedTypes
  });

  /**
   * 1. If the query is a valid IPFS hash, open it
   * 2. If the query matches exactly one DNP, open it
   * 0. Else open the query
   */
  function runQuery() {
    if (utils.isIpfsHash(query)) return openDnp(query);
    if (directoryFiltered.length === 1)
      return openDnp(directoryFiltered[0].name);
    else openDnp(query);
  }

  const types = {
    ...directory.reduce((obj, { manifest = {} }) => {
      if (manifest.type) obj[manifest.type] = false;
      return obj;
    }, {}),
    ...selectedTypes
  };

  /**
   * Isolate the switching logic:
   * 1. If there is a search and it's empty show "NoDnp"
   * 2. If it is still syncing, show "IsSyncing"
   * 3. If it is loading, show "Loading"
   * 0. Else show the DnpStore
   */
  function Body() {
    if (directory.length && !directoryFiltered.length)
      return <NoPackageFound query={query} />;
    if (mainnet.syncing) return <IsSyncing {...mainnet} />;
    if (isLoading && !directory.length) return <Loading />;
    return <PackageStore directory={directoryFiltered} openDnp={openDnp} />;
  }

  return (
    <>
      <Input
        placeholder="DNP's name or IPFS hash"
        value={query}
        onValueChange={value => setQuery(utils.correctPackageName(value))}
        onEnterPress={runQuery}
        append={<ButtonLight onClick={runQuery}>Search</ButtonLight>}
      />

      <TypeFilter types={types} onTypeChange={onTypeChange} />

      <Body />
    </>
  );
}

InstallerHome.propTypes = {
  // State -> props
  directory: PropTypes.array.isRequired,
  selectedTypes: PropTypes.object.isRequired,
  inputValue: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  mainnet: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // Dispatch -> props
  fetchPackageData: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  directory: s.getDnpDirectoryWithTagsNonCores,
  directoryLoaded: s.directoryLoaded,
  selectedTypes: s.getSelectedTypes,
  inputValue: s.getInputValue,
  mainnet: getMainnet,
  isLoading: getIsLoadingById("dnpDirectory")
});

const mapDispatchToProps = {
  fetchPackageData: a.fetchPackageData
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerHome);
