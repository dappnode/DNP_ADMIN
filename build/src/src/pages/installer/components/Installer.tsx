import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
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
import {
  getProgressLogsByDnp,
  getIsInstallingLogs
} from "services/isInstallingLogs/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
import { getDnpRequest } from "services/dnpRequest/selectors";
// Components
import Info from "./Steps/Info";
import SetupWizard from "./Steps/SetupWizard";
import Permissions from "./Steps/Permissions";
import Disclaimer from "./Steps/Disclaimer";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// ### Move out
import "./stepper.scss";
import Title from "components/Title";
import { RequestedDnp } from "types";

interface InstallerInterfaceProps {
  dnp: RequestedDnp;
  progressLogs: { [dnpName: string]: string };
}

/**
 * [WARNING!] Do NOT store the userSetFormData as it may contain large files,
 * or do it with caution. The size of userSetFormData stringified is not found
 */
// const getUniqueId = dnp =>
//   "dappnode-user-set-form-data-" + dnp.origin ||
//   (dnp.manifest || {}).name + (dnp.manifest || {}).version;

const InstallerInterface: React.FunctionComponent<
  InstallerInterfaceProps & RouteComponentProps
> = ({
  dnp,
  progressLogs,
  // Extra
  history,
  location,
  match
}) => {
  const [userSetFormData, setUserSetFormData] = useState({});
  const [options, setOptions] = useState({} as { [optionId: string]: boolean });

  const { name, version, origin, metadata } = dnp;
  const type = metadata.type;
  const setupSchema = dnp.setupSchema;
  const setupUiSchema = dnp.setupUiSchema;
  const permissions = parseSpecialPermissions(metadata);
  const requiresCoreUpdate = dnp.request.compatible.requiresCoreUpdate;

  /**
   * Construct disclaimer
   */
  const disclaimers: { name: string; message: string }[] = [];
  // Default disclaimer for public DNPs
  if (!isDnpVerified(dnp.name) || dnp.origin)
    disclaimers.push({
      name: "Unverified package",
      message:
        "This package has been developed by a third party. DAppNode association is not maintaining this package and has not performed any audit on its content. Use it at your own risk. DAppNode will not be liable for any loss or damage produced by the use of this package"
    });
  if (metadata.disclaimer)
    disclaimers.push({
      name: shortNameCapitalized(name),
      message: metadata.disclaimer.message
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
    // install({ name, version, userSet: userSetFormData, options });
    console.log("INSTALLING!!");
  }

  /**
   * Filter options according to the current package
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const availableOptions = [];
  if (origin && type === "dncore")
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
          setupSchema={setupSchema || {}}
          setupUiSchema={setupUiSchema || {}}
          onSubmit={(formData: any) => {
            setUserSetFormData(formData);
            goNext();
          }}
          goBack={goBack}
          initialFormData={userSetFormData}
        />
      ),
      available: !isEmpty(setupSchema)
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

  // Do this in a different way
  // useEffect(() => {
  //   if (isQueryDnpUpdated && name) history.push(packagesRootPath + "/" + name);
  // }, [tag, name, isQueryDnpUpdated, history]);

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
                className={`steps-step ${joinCssClass({
                  active,
                  completed
                })}`}
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
};

// Container

const getIdFromOwnProps = (ownProps: { match?: { params: { id: string } } }) =>
  ((ownProps.match || {}).params || {}).id || "";

const mapStateToProps = createStructuredSelector({
  dnp: (state: any, ownProps: any) =>
    getDnpRequest(state, getIdFromOwnProps(ownProps))
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchPackageRequest: a.fetchPackageRequest
};

export default withRouter(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
