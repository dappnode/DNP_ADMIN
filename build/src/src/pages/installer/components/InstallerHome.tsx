import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
// This page
import * as a from "../actions";
import * as s from "../selectors";
import isIpfsHash from "utils/isIpfsHash";
import isDnpDomain from "utils/isDnpDomain";
import { correctPackageName } from "../utils";
import filterDirectory from "../helpers/filterDirectory";
import { rootPath } from "../data";
import NoPackageFound from "./NoPackageFound";
import CategoryFilter from "./CategoryFilter";
import DnpStore from "./DnpStore";
// Components
import Title from "components/Title";
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import { getMainnet } from "services/chainData/selectors";
import {
  getIsLoading,
  getLoadingError
} from "services/loadingStatus/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Styles
import "./installer.scss";
import IsSyncing from "./IsSyncing";
import { DirectoryItem } from "types";
import { SelectedCategories } from "../types";

interface InstallerHomeProps {
  directory: DirectoryItem[];
  mainnetIsSyncing: boolean;
  loading: boolean;
  error: string;
  fetchPackageDataFromQuery: (query: string) => void;
}

const InstallerHome: React.FunctionComponent<
  InstallerHomeProps & RouteComponentProps
> = ({
  // variables
  directory,
  mainnetIsSyncing,
  loading,
  error,
  history,
  // Actions
  fetchPackageDataFromQuery
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(
    {} as SelectedCategories
  );

  useEffect(() => {
    // If the packageLink is a valid IPFS hash preload it's info
    if (isIpfsHash(query) || isDnpDomain(query))
      fetchPackageDataFromQuery(query);
  }, [query, fetchPackageDataFromQuery]);

  function openDnp(id: string) {
    const dnp = directory.find(({ name }) => name === id);
    if (dnp && dnp.isUpdated) history.push(packagesRootPath + "/" + dnp.name);
    else history.push(rootPath + "/" + encodeURIComponent(id));
  }

  function onCategoryChange(category: string) {
    setSelectedCategories(x => ({ ...x, [category]: !x[category] }));
  }

  const directoryFiltered = filterDirectory({
    directory,
    query,
    selectedCategories
  });

  /**
   * 1. If the query is a valid IPFS hash, open it
   * 2. If the query matches exactly one DNP, open it
   * 0. Else open the query
   */
  function runQuery() {
    if (isIpfsHash(query)) return openDnp(query);
    if (directoryFiltered.length === 1)
      return openDnp(directoryFiltered[0].name);
    else openDnp(query);
  }

  const categories = {
    ...directory.reduce((obj: SelectedCategories, { categories }) => {
      for (const category of categories) obj[category] = false;
      return obj;
    }, {}),
    ...selectedCategories
  };

  /**
   * Switching logic:
   * 1. If there is a search and it's empty show "NoDnp"
   * 2. If it is still syncing, show "IsSyncing"
   * 3. If it is loading, show "Loading"
   * 0. Else show the DnpStore
   */

  return (
    <>
      <Title title="Installer" />

      <Input
        placeholder="DAppNode Package's name or IPFS hash"
        value={query}
        onValueChange={(value: string) => setQuery(correctPackageName(value))}
        onEnterPress={runQuery}
        append={<ButtonLight onClick={runQuery}>Search</ButtonLight>}
      />

      <CategoryFilter
        categories={categories}
        onCategoryChange={onCategoryChange}
      />

      {directory.length ? (
        !directoryFiltered.length ? (
          <NoPackageFound query={query} />
        ) : (
          <>
            <DnpStore
              directory={directoryFiltered.filter(dnp => dnp.isFeatured)}
              openDnp={openDnp}
              featured
            />
            <DnpStore
              directory={directoryFiltered.filter(dnp => !dnp.isFeatured)}
              openDnp={openDnp}
            />
          </>
        )
      ) : mainnetIsSyncing ? (
        <IsSyncing />
      ) : error ? (
        <Error msg={`Error loading DAppNode Packages: ${error}`} />
      ) : loading ? (
        <Loading msg="Loading DAppNode Packages..." />
      ) : (
        <Error msg={`Unknown error`} />
      )}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  directory: s.getDnpDirectoryWithTagsNonCores,
  directoryLoaded: s.directoryLoaded,
  mainnetIsSyncing: state => Boolean((getMainnet(state) || {}).syncing),
  loading: getIsLoading.dnpDirectory,
  error: getLoadingError.dnpDirectory
});

const mapDispatchToProps = {
  fetchPackageDataFromQuery: a.fetchPackageDataFromQuery
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerHome);
