import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Switch, Route, Redirect } from "react-router-dom";
// This module
import * as s from "../selectors";
import * as a from "../actions";
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
// Utils
import { shortNameCapitalized, isDnpVerified } from "utils/format";
import { joinCssClass } from "utils/css";
// Parsers
import parseSpecialPermissions from "../parsers/parseSpecialPermissions";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Components
import Info from "./Steps/Info";
import SetupWizard from "./Steps/SetupWizard";
import Permissions from "./Steps/Permissions";
import Disclaimer from "./Steps/Disclaimer";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// ### Move out
import "./stepper.scss";

/**
 * [WARNING!] Do NOT store the userSetFormData as it may contain large files,
 * or do it with caution. The size of userSetFormData stringified is not found
 */
// const getUniqueId = dnp =>
//   "dappnode-user-set-form-data-" + dnp.origin ||
//   (dnp.manifest || {}).name + (dnp.manifest || {}).version;

function InstallerInterface({
  id,
  dnp,
  isQueryDnpUpdated,
  requiresCoreUpdate,
  progressLogs,
  // Actions
  install,
  clearUserSet,
  fetchPackageRequest,
  // Extra
  history,
  location,
  match
}) {
  const [userSetFormData, setUserSetFormData] = useState({});
  const [options, setOptions] = useState({});

  useEffect(() => {
    clearUserSet();
    fetchPackageRequest(id);
  }, [id, clearUserSet, fetchPackageRequest]);

  const { loading, error, manifest, tag } = dnp || {};
  const { name, type } = manifest || {};
  const wizard = (manifest || {}).wizard;
  const permissions = parseSpecialPermissions(dnp.manifest);
  const disclaimerObj = (manifest || {}).disclaimer;

  /**
   * Construct disclaimer
   */
  const disclaimers = [];
  // Default disclaimer for public DNPs
  if (!isDnpVerified(dnp.name) || dnp.origin)
    disclaimers.push({
      name: "Unverified package",
      message:
        "This package has been developed by a third party. DAppNode association is not maintaining this package and has not performed any audit on its content. Use it at your own risk. DAppNode will not be liable for any loss or damage produced by the use of this package"
    });
  if (disclaimerObj)
    disclaimers.push({
      name: shortNameCapitalized(name),
      message: disclaimerObj.message
    });

  /**
   * Construct options
   */
  const optionsArray = [
    {
      name: "Bypass core restriction",
      id: "BYPASS_CORE_RESTRICTION",
      available: dnp.origin && type === "dncore"
    }
  ]
    .filter(option => option.available)
    .map(option => ({
      ...option,
      checked: options[option.id],
      toggle: () =>
        setOptions(x => ({ ...x, [option.id]: !options[option.id] }))
    }));

  /**
   * Call the install method with the gathered data
   */
  function onInstall() {
    install({ id, userSet: userSetFormData, options });
  }

  /**
   * Filter options according to the current package
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const availableOptions = [];
  if ((id || "").startsWith("/ipfs/") && type === "dncore")
    availableOptions.push("BYPASS_CORE_RESTRICTION");

  const disableInstallation = !isEmpty(progressLogs) || requiresCoreUpdate;

  const setupSubPath = "setup";
  const permissionsSubPath = "permissions";
  const disclaimerSubPath = "disclaimer";
  const installSubPath = "install";

  const availableRoutes = [
    {
      name: "Setup",
      subPath: setupSubPath,
      render: () => (
        <SetupWizard
          wizard={wizard}
          onSubmit={formData => {
            setUserSetFormData(formData);
            goNext();
          }}
          goBack={goBack}
          initialFormData={userSetFormData}
        />
      ),
      available: !isEmpty(wizard)
    },
    {
      name: "Permissions",
      subPath: permissionsSubPath,
      render: () => (
        <Permissions
          permissions={permissions}
          onAccept={goNext}
          goBack={goBack}
        />
      ),
      available: permissions.length > 0
    },
    {
      name: "Disclaimer",
      subPath: disclaimerSubPath,
      render: () => (
        <Disclaimer
          disclaimers={disclaimers}
          onAccept={goNext}
          goBack={goBack}
        />
      ),
      available: disclaimers.length > 0
    },
    // Placeholder for the final step in the horizontal stepper
    {
      name: "Install",
      subPath: installSubPath,
      available: true
    }
  ].filter(route => route.available);

  // Compute the route index for the stepper display
  const currentSubRoute =
    (location.pathname || "").split(match.url + "/")[1] || "";
  const currentIndex = availableRoutes.findIndex(
    ({ subPath }) => subPath && currentSubRoute.includes(subPath)
  );

  /**
   * Logic to control which route requires a redirect and when
   * - "install": never okay, redirect to the main page
   * - When the DNP is updated (finish installation), redirect to /packages
   */
  useEffect(() => {
    if (currentSubRoute) history.push(match.url);
  }, []);
  useEffect(() => {
    if (isQueryDnpUpdated && name) history.push(packagesRootPath + "/" + name);
  }, [tag, name, isQueryDnpUpdated, history]);

  function goNext() {
    const nextIndex = currentIndex + 1;
    // When going to the last step "install", redirect to home and install
    if (nextIndex >= availableRoutes.length - 1) {
      history.push(match.url);
      onInstall();
    } else {
      const nextStep = availableRoutes[nextIndex];
      if (nextStep) history.push(`${match.url}/${nextStep.subPath}`);
    }
  }

  function goBack() {
    const prevStep = availableRoutes[currentIndex - 1];
    if (prevStep) history.push(`${match.url}/${prevStep.subPath}`);
    else history.push(match.url);
  }

  if (error && !manifest) return <Error msg={`Error: ${error}`} />;
  if (loading) return <Loading msg={"Loading DAppNode Package data..."} />;
  if (!dnp && !error) return <Error msg={"DAppNode Package not found"} />;

  return (
    <>
      <ProgressLogs progressLogs={progressLogs} />

      {requiresCoreUpdate && (
        <div className="alert alert-danger">
          <strong>{shortNameCapitalized(name)}</strong> requires a more recent
          version of DAppNode. <strong>Update your DAppNode</strong> before
          continuing the installation.
        </div>
      )}

      {currentIndex >= 0 && availableRoutes.length > 1 && (
        <div className="horizontal-stepper">
          {availableRoutes.map((route, i) => {
            const active = currentIndex === i;
            const completed = currentIndex > i;
            return (
              <div
                key={route.name}
                className={`steps-step ${joinCssClass({ active, completed })}`}
              >
                <div className="connector">
                  <span />
                </div>
                <span className="step-label">
                  <span className="icon-container circle">
                    {completed ? <span>✔</span> : <span>{i + 1}</span>}
                  </span>
                  <span className="text-container">
                    <span className="text">{route.name}</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Switch>
        <Route
          path={match.path}
          exact
          render={() => (
            <Info
              dnp={dnp}
              onInstall={() => goNext()}
              disableInstallation={disableInstallation}
              optionsArray={optionsArray}
            />
          )}
        />
        {availableRoutes
          .filter(route => route.render)
          .map(route => (
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
    </>
  );
}

InstallerInterface.propTypes = {
  id: PropTypes.string.isRequired,
  dnp: PropTypes.object,
  history: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  id: s.getQueryId,
  dnp: s.getQueryDnp,
  isQueryDnpUpdated: s.getIsQueryDnpUpdated,
  requiresCoreUpdate: s.getQueryDnpRequiresCoreUpdate,
  progressLogs: (state, ownProps) =>
    getProgressLogsByDnp(state, s.getQueryIdOrName(state, ownProps)),
  // For the withTitle HOC
  subtitle: (state, ownProps) =>
    shortNameCapitalized(s.getQueryIdOrName(state, ownProps))
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchPackageRequest: a.fetchPackageRequest
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
