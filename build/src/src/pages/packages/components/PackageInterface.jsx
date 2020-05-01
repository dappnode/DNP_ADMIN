import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
// This module
import Info from "./PackageViews/Info";
import { dnpSpecificList, dnpSpecific } from "./PackageViews/DnpSpecific";
import Logs from "./PackageViews/Logs";
import Config from "./PackageViews/Config";
import Ports from "./PackageViews/Ports";
import FileManager from "./PackageViews/FileManager";
import Backup from "./PackageViews/Backup";
import Controls from "./PackageViews/Controls";
import NoDnpInstalled from "./NoDnpInstalled";
import * as s from "../selectors";
import { title } from "../data";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Utils
import { shortNameCapitalized } from "utils/format";
// Selectors
import {
  getDnpInstalledStatus,
  getDnpInstalledDataById
} from "services/dnpInstalled/selectors";
import { fetchDnpInstalledData } from "services/dnpInstalled/actions";

const PackageInterface = ({
  dnp,
  dnpDetail,
  id,
  moduleName,
  areThereDnps,
  requestStatus: { loading, error },
  match,
  // Actions
  fetchDnpInstalledData
}) => {
  useEffect(() => {
    fetchDnpInstalledData({ id });
  }, [id, fetchDnpInstalledData]);

  if (!dnp) {
    if (loading) return <Loading msg="Loading your DAppNode Packages..." />;
    if (error)
      return <Error msg={`Error loading your DAppNode Packages: ${error}`} />;
    if (areThereDnps) return <NoDnpInstalled id={id} moduleName={moduleName} />;
    return <Error msg={`Unknown error, package not found`} />;
  }

  const DnpSpecific = dnpSpecific[dnp.name];
  const backup = (dnp.manifest || {}).backup || [];

  /**
   * Construct all subroutes to iterate them both in:
   * - Link (to)
   * - Route (render, path)
   */
  const availableRoutes = [
    {
      name: "Info",
      subPath: "info",
      render: () => <Info dnp={dnp} dnpDetail={dnpDetail} />,
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
      name: "Ports",
      subPath: "ports",
      render: () => <Ports dnp={dnp} />,
      available: dnp.name !== "dappmanager.dnp.dappnode.eth"
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
      render: () => <Backup id={dnp.name} backup={backup} />,
      available: backup.length > 0
    },
    {
      name: "File Manager",
      subPath: "file-manager",
      render: ({ ...props }) => <FileManager {...props} id={dnp.name} />,
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
      available: DnpSpecific && dnpSpecificList[dnp.name]
    }
  ].filter(route => route.available);

  return (
    <>
      <div className="horizontal-navbar">
        {availableRoutes.map(route => (
          <button key={route.subPath} className="item-container">
            <NavLink
              to={`${match.url}/${route.subPath}`}
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
              path={`${match.path}/${route.subPath}`}
              render={route.render}
            />
          ))}
          {/* Redirect automatically to the first route. DO NOT hardcode 
              to prevent typos and causing infinite loops */}
          <Redirect to={`${match.url}/${availableRoutes[0].subPath}`} />
        </Switch>
      </div>
    </>
  );
};

PackageInterface.propTypes = {
  dnp: PropTypes.object,
  id: PropTypes.string,
  moduleName: PropTypes.string.isRequired
};

// Container

function getIdFromMatch(match) {
  return decodeURIComponent(((match || {}).params || {}).id || "");
}

const mapStateToProps = createStructuredSelector({
  dnp: s.getDnp,
  // id and moduleName are parsed from the url at the selector (with the router state)
  id: (_, ownProps) => ((ownProps.match || {}).params || {}).id,
  moduleName: s.getModuleName,
  areThereDnps: s.areThereDnps,
  requestStatus: getDnpInstalledStatus,
  // For the withTitle HOC
  subtitle: (state, ownProps) =>
    shortNameCapitalized(getIdFromMatch(ownProps.match)),
  dnpDetail: (state, ownProps) =>
    getDnpInstalledDataById(state, getIdFromMatch(ownProps.match))
});

const mapDispatchToProps = {
  fetchDnpInstalledData
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle(title)
)(PackageInterface);
