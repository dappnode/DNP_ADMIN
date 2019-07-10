import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import * as s from "../selectors";
import { rootPath, title } from "../data";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
// Components
import Info from "./PackageViews/Info";
import DnpSpecific, { dnpSpecificList } from "./PackageViews/DnpSpecific";
import Logs from "./PackageViews/Logs";
import Config from "./PackageViews/Config";
import FileManager from "./PackageViews/FileManager";
import Backup from "./PackageViews/Backup";
import Controls from "./PackageViews/Controls";
import NoDnpInstalled from "./NoDnpInstalled";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import {
  getIsLoading,
  getLoadingError
} from "services/loadingStatus/selectors";

const PackageInterface = ({
  dnp,
  id,
  moduleName,
  areThereDnps,
  loading,
  error,
  match
}) => {
  if (!dnp) {
    if (loading) return <Loading msg="Loading your DAppNode Packages..." />;
    if (error)
      return <Error msg={`Error loading your DAppNode Packages: ${error}`} />;
    if (areThereDnps) return <NoDnpInstalled id={id} moduleName={moduleName} />;
    return <Error msg={`Unknown error, package not found`} />;
  }

  const urlId = match.params.id;

  /**
   * Construct all subroutes to iterate them both in:
   * - Link (to)
   * - Route (render, path)
   */
  const availableRoutes = [
    {
      name: "Info",
      subPath: "info",
      render: () => <Info dnp={dnp} />,
      available: true
    },
    {
      name: "Controls",
      subPath: "controls",
      render: () => <Controls dnp={dnp} />,
      available: true
    },
    {
      name: "Config",
      subPath: "config",
      render: () => <Config dnp={dnp} />,
      available: Object.keys(dnp.envs || {}).length
    },
    {
      name: "Logs",
      subPath: "logs",
      render: () => <Logs id={dnp.name} />,
      available: true
    },
    {
      name: "Backup",
      subPath: "backup",
      render: () => <Backup dnp={dnp} />,
      available: (dnp.backup || []).length
    },
    {
      name: "File Manager",
      subPath: "file-manager",
      render: () => <FileManager dnp={dnp} />,
      available: true
    },
    // DnpSpecific is a variable dynamic per DNP component
    {
      name: dnpSpecificList[dnp.name],
      // Convert name to subPath:
      // "Connect with peers" => "connect-with-peers"
      subPath: encodeURIComponent(
        (dnpSpecificList[dnp.name] || "")
          .toLowerCase()
          .replace(new RegExp(" ", "g"), "-")
      ),
      render: () => <DnpSpecific dnp={dnp} />,
      available: dnpSpecificList[dnp.name]
    }
  ]
    .map(route => ({
      ...route,
      path: `${rootPath}/:id/${route.subPath}`,
      to: `${rootPath}/${urlId}/${route.subPath}`
    }))
    .filter(route => route.available);

  return (
    <>
      <div className="horizontal-navbar">
        {availableRoutes.map(route => (
          <button key={route.subPath} className="item-container">
            <NavLink
              to={route.to}
              className="item no-a-style"
              style={{ whiteSpace: "nowrap" }}
            >
              {route.name}
            </NavLink>
          </button>
        ))}
      </div>

      <div className="packages-content">
        <Switch>
          {availableRoutes.map(route => (
            <Route
              key={route.subPath}
              path={route.path}
              render={route.render}
            />
          ))}
          {/* Redirect automatically to the first route. DO NOT hardcode 
              to prevent typos and causing infinite loops */}
          <Redirect to={`${rootPath}/${urlId}/${availableRoutes[0].subPath}`} />
        </Switch>
      </div>
    </>
  );
};

PackageInterface.propTypes = {
  dnp: PropTypes.object,
  id: PropTypes.string,
  moduleName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  dnp: s.getDnp,
  // id and moduleName are parsed from the url at the selector (with the router state)
  id: s.getUrlId,
  moduleName: s.getModuleName,
  areThereDnps: s.areThereDnps,
  loadingDnps: getIsLoading.dnpInstalled,
  loading: getIsLoading.dnpInstalled,
  error: getLoadingError.dnpInstalled,
  // For the withTitle HOC
  subtitle: s.getUrlId
});

const mapDispatchToProps = null;

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle(title)
)(PackageInterface);
