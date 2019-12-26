import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { throttle, isEmpty } from "lodash";
import { DirectoryItem, RequestStatus } from "types";
import { SelectedCategories } from "../types";
// This page
import isIpfsHash from "utils/isIpfsHash";
import isDnpDomain from "utils/isDnpDomain";
import { correctPackageName } from "../utils";
import filterDirectory from "../helpers/filterDirectory";
import { rootPath } from "../data";
import NoPackageFound from "./NoPackageFound";
import CategoryFilter from "./CategoryFilter";
import DnpStore from "./DnpStore";
import IsSyncing from "./IsSyncing";
// Components
import Title from "components/Title";
import Input from "components/Input";
import Button, { ButtonLight } from "components/Button";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import { getMainnet } from "services/chainData/selectors";
import {
  getDnpDirectory,
  getDirectoryRequestStatus
} from "services/dnpDirectory/selectors";
import { fetchDnpDirectory } from "services/dnpDirectory/actions";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Styles
import "./installer.scss";

interface InstallerHomeProps {
  directory: DirectoryItem[];
  mainnetIsSyncing: boolean;
  requestStatus: RequestStatus;
  fetchDnpDirectory: () => void;
}

const InstallerHome: React.FunctionComponent<
  InstallerHomeProps & RouteComponentProps
> = ({
  // variables
  directory,
  mainnetIsSyncing,
  requestStatus,
  history,
  // Actions
  fetchDnpDirectory
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(
    {} as SelectedCategories
  );
  const [showErrorDnps, setShowErrorDnps] = useState(false);

  useEffect(() => {
    fetchDnpDirectory();
  }, [fetchDnpDirectory]);

  // Limit the number of requests [TESTED]
  const fetchQueryThrottled = useMemo(
    () =>
      throttle((query: string) => {
        // #### TODO: provide feedback to the user if the query is found
      }, 500),
    []
  );

  useEffect(() => {
    fetchQueryThrottled(query);
    // If the packageLink is a valid IPFS hash preload it's info
    if (isIpfsHash(query) || isDnpDomain(query)) fetchQueryThrottled(query);
  }, [query, fetchQueryThrottled]);

  function openDnp(id: string) {
    const dnp = directory.find(({ name }) => name === id);
    if (dnp && dnp.status === "ok" && dnp.isUpdated)
      history.push(packagesRootPath + "/" + dnp.name);
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
    ...directory.reduce((obj: SelectedCategories, dnp) => {
      if (dnp.status === "ok")
        for (const category of dnp.categories) obj[category] = false;
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

  const dnpsNoError = directoryFiltered.filter(dnp => dnp.status !== "error");
  const dnpsFeatured = dnpsNoError.filter(dnp => dnp.isFeatured);
  const dnpsNormal = dnpsNoError.filter(dnp => !dnp.isFeatured);
  const dnpsError = directoryFiltered.filter(dnp => dnp.status === "error");

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

      {isEmpty(categories) && directory.length ? (
        <div className="type-filter placeholder" />
      ) : (
        <CategoryFilter
          categories={categories}
          onCategoryChange={onCategoryChange}
        />
      )}

      {directory.length ? (
        !directoryFiltered.length ? (
          <NoPackageFound query={query} />
        ) : (
          <div className="dnps-container">
            <DnpStore directory={dnpsFeatured} openDnp={openDnp} featured />
            <DnpStore directory={dnpsNormal} openDnp={openDnp} />
            {dnpsError.length ? (
              showErrorDnps ? (
                <DnpStore directory={dnpsError} openDnp={openDnp} />
              ) : (
                <Button onClick={() => setShowErrorDnps(true)}>
                  Show packages still propagating
                </Button>
              )
            ) : null}
          </div>
        )
      ) : mainnetIsSyncing ? (
        <IsSyncing />
      ) : requestStatus.error ? (
        <Error
          msg={`Error loading DAppNode Packages: ${requestStatus.error}`}
        />
      ) : requestStatus.loading ? (
        <Loading msg="Loading DAppNode Packages..." />
      ) : requestStatus.success ? (
        <Error msg={"Directory loaded but found no packages"} />
      ) : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  directory: getDnpDirectory,
  requestStatus: getDirectoryRequestStatus,
  mainnetIsSyncing: state => Boolean((getMainnet(state) || {}).syncing)
});

const mapDispatchToProps = {
  fetchDnpDirectory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerHome);
