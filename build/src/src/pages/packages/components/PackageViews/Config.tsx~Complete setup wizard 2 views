import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
// Components
import SetupWizard from "pages/installer/components/Steps/SetupWizard/SetupWizard";
// Utils
import {
  PackageContainer,
  PackageDetailData,
  PackageEnvs,
  UserSettingsAllDnps
} from "types";

function Config({
  dnp,
  dnpDetail,
  updatePackageEnv
}: {
  dnp?: PackageContainer;
  dnpDetail?: PackageDetailData;
  updatePackageEnv: (id: string, envs: PackageEnvs) => void;
}) {
  const name = dnp ? dnp.name : "dnp";
  const environment = dnp ? dnp.envs : {};
  const setupWizardDnp = (dnpDetail || {}).setupWizard;
  const userSettingsDnp = (dnpDetail || {}).userSettings;
  const setupWizard = setupWizardDnp ? { [name]: setupWizardDnp } : {};
  const userSettings = userSettingsDnp ? { [name]: { environment } } : {};

  function onSubmit(newUserSettings: UserSettingsAllDnps) {
    if (dnp && dnp.name) {
      const newEnvs = newUserSettings[name].environment;
      if (newEnvs) {
        // Merge ENVs just in case the setupWizard does not return the full object
        updatePackageEnv(dnp.name, {
          ...((userSettingsDnp || {}).environment || {}),
          ...newEnvs
        });
      }
    } else {
      console.error(`Can't update ENVs because dnp.name not defined`, dnp);
    }
  }

  return (
    <SetupWizard
      setupWizard={setupWizard}
      userSettings={userSettings}
      onSubmit={onSubmit}
      submitTag="Update"
    />
  );
}

// Container

const mapDispatchToProps = {
  updatePackageEnv: action.updatePackageEnv
};

export default connect(
  null,
  mapDispatchToProps
)(Config);
