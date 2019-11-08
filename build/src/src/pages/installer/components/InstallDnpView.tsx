import React, { useState, useEffect } from "react";
import * as api from "API/calls";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { isEmpty, throttle, pick } from "lodash";
import { difference, isDeepEmpty } from "utils/lodashExtended";
import { shortNameCapitalized, isDnpVerified } from "utils/format";
// This module
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
// Parsers
import parseSpecialPermissions from "../parsers/parseSpecialPermissions";
// Components
import Info from "./Steps/Info";
import SetupWizard from "./Steps/SetupWizard";
import Permissions from "./Steps/Permissions";
import Disclaimer from "./Steps/Disclaimer";
import HorizontalStepper from "./HorizontalStepper";
import { RequestedDnp, UserSettingsAllDnps } from "types";

const BYPASS_CORE_RESTRICTION = "BYPASS_CORE_RESTRICTION";
const SHOW_ADVANCED_EDITOR = "SHOW_ADVANCED_EDITOR";

interface InstallDnpViewProps {
  dnp: RequestedDnp;
  progressLogs?: { [dnpName: string]: string };
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

  const { name, reqVersion, settings, metadata } = dnp;
  const type = metadata.type;
  const setupSchema = dnp.setupSchema;
  const setupUiSchema = dnp.setupUiSchema;
  const permissions = parseSpecialPermissions(metadata);
  const requiresCoreUpdate = dnp.request.compatible.requiresCoreUpdate;
  const wizardAvailable = !!setupSchema && !isDeepEmpty(setupSchema);
  const oldEditorAvailable = Boolean(userSettings);

  useEffect(() => {
    setUserSettings(settings || {});
  }, [settings, setUserSettings]);

  const onInstall = async (newData?: {
    newUserSettings: UserSettingsAllDnps;
  }) => {
    // Since React update order is not guaranteed, pass newUserSettings as a
    // parameter if necessary to ensure it has the latest state
    const _userSettings =
      newData && newData.newUserSettings
        ? newData.newUserSettings
        : userSettings;

    const kwargs = {
      name,
      version: reqVersion,
      // Send only relevant data, ignoring settings that are equal to the current
      userSettings: difference(settings || {}, _userSettings),
      // Prevent sending the SHOW_ADVANCED_EDITOR option
      options: pick(options, [BYPASS_CORE_RESTRICTION])
    };

    // Do the process here to control when the installation finishes,
    // and do some nice transition to the package
    console.log("Installing DNP", kwargs);
    try {
      await api.installPackage(kwargs, {
        toastMessage: `Installing ${shortNameCapitalized(name)}...`
      });
    } catch (e) {
      console.error(e);
    } finally {
      // Clean is installing logs
    }
  };
  // Prevent a burst of install calls
  const onInstallThrottle = throttle(onInstall, 1000);

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
      name: "Show advanced editor",
      id: SHOW_ADVANCED_EDITOR,
      available: !wizardAvailable && oldEditorAvailable
    },
    {
      name: "Bypass core restriction",
      id: BYPASS_CORE_RESTRICTION,
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
          userSettings={userSettings}
          wizardAvailable={wizardAvailable}
          onSubmit={(newUserSettings: UserSettingsAllDnps) => {
            console.log("Set new userSettings", newUserSettings);
            setUserSettings(newUserSettings);
            goNext({ newUserSettings });
          }}
          goBack={goBack}
        />
      ),
      available: wizardAvailable || options[SHOW_ADVANCED_EDITOR]
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

  function goNext(newData?: { newUserSettings: UserSettingsAllDnps }) {
    const nextIndex = currentIndex + 1;
    // When going to the last step "install", redirect to home and install
    if (nextIndex >= availableRoutes.length - 1) {
      // Prevent re-renders and pushing the same route
      if (location.pathname !== match.url) history.push(match.url);
      onInstallThrottle(newData);
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
      {progressLogs && <ProgressLogs progressLogs={progressLogs} />}

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
