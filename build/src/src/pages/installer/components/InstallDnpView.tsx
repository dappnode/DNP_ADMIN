import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as api from "API/calls";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { isEmpty, throttle } from "lodash";
import { Switch, Route, Redirect } from "react-router-dom";
// This module
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
// Utils
import { shortNameCapitalized, isDnpVerified } from "utils/format";
// Parsers
import parseSpecialPermissions from "../parsers/parseSpecialPermissions";
// Components
import Info from "./Steps/Info";
import SetupWizard from "./Steps/SetupWizard";
import Permissions from "./Steps/Permissions";
import Disclaimer from "./Steps/Disclaimer";
import HorizontalStepper from "./HorizontalStepper";
import { RequestedDnp, UserSettingsAllDnps } from "types";
import difference from "../parsers/difference";

interface InstallDnpViewProps {
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

const InstallDnpView: React.FunctionComponent<
  InstallDnpViewProps & RouteComponentProps
> = ({
  dnp,
  progressLogs,
  // Extra
  history,
  location,
  match
}) => {
  const [userSettings, setUserSettings] = useState({} as UserSettingsAllDnps);
  const [options, setOptions] = useState({} as { [optionId: string]: boolean });

  const { name, version, settings, metadata } = dnp;
  const type = metadata.type;
  const setupSchema = dnp.setupSchema;
  const setupUiSchema = dnp.setupUiSchema;
  const permissions = parseSpecialPermissions(metadata);
  const requiresCoreUpdate = dnp.request.compatible.requiresCoreUpdate;

  useEffect(() => {
    setUserSettings(settings || {});
  }, [settings, setUserSettings]);

  /**
   * Call the install method with the gathered data
   */
  const onInstall = useCallback(() => {
    // To only send / log the relevant data
    // Prevent sending settings that are equal to the current
    const userSettingsDiff = difference(settings || {}, userSettings);
    console.log("Installing DNP", { name, version, userSettingsDiff });
    api
      .installPackage(
        { name, version, userSettings: userSettingsDiff },
        { toastMessage: `Installing ${shortNameCapitalized(name)}...` }
      )
      .catch(console.error);
  }, [name, version, settings, userSettings]);
  // Prevent a burst of install calls
  const onInstallThrottle = useMemo(() => throttle(onInstall, 1000), [
    onInstall
  ]);

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
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const optionsArray = [
    {
      name: "Bypass core restriction",
      id: "BYPASS_CORE_RESTRICTION",
      available: true || (dnp.origin && type === "dncore")
    }
  ]
    .filter(option => option.available)
    .map(option => ({
      ...option,
      checked: options[option.id],
      toggle: () =>
        setOptions(x => ({ ...x, [option.id]: !options[option.id] }))
    }));

  const disableInstallation = !isEmpty(progressLogs) || requiresCoreUpdate;

  const setupSubPath = "setup";
  const permissionsSubPath = "permissions";
  const disclaimerSubPath = "disclaimer";
  const installSubPath = "install";

  const availableRoutes = [
    {
      name: "Setup",
      subPath: setupSubPath,
      render: () =>
        setupSchema ? (
          <SetupWizard
            setupSchema={setupSchema}
            setupUiSchema={setupUiSchema || {}}
            onSubmit={(newUserSettings: UserSettingsAllDnps) => {
              console.log("Set new userSettings", newUserSettings);
              setUserSettings(newUserSettings);
              goNext();
            }}
            userSettings={userSettings}
            goBack={goBack}
          />
        ) : null,
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
      onInstallThrottle();
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
        <HorizontalStepper
          routes={availableRoutes.map(route => route.name)}
          currentIndex={currentIndex}
        />
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

export default withRouter(InstallDnpView);
