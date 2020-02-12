import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
// Components
import SetupWizard from "pages/installer/components/Steps/SetupWizard/SetupWizard";
// Utils
import { PackageContainer, PackageDetailData } from "types";

function Config({
  dnp,
  dnpDetail,
  updateEnvs
}: {
  dnp?: PackageContainer;
  dnpDetail?: PackageDetailData;
  updateEnvs: () => {};
}) {
  const name = dnp ? dnp.name : "dnp";
  const setupWizardDnp = (dnpDetail || {}).setupWizard;
  const userSettingsDnp = (dnpDetail || {}).userSettings;
  const setupWizard = setupWizardDnp ? { [name]: setupWizardDnp } : {};
  const userSettings = userSettingsDnp ? { [name]: userSettingsDnp } : {};
  return (
    <SetupWizard
      setupWizard={setupWizard}
      userSettings={userSettings}
      wizardAvailable={true}
      onSubmit={() => {}}
      goBack={() => {}}
    />
  );
}

// Container

const mapDispatchToProps = {
  updateEnvs: action.updatePackageEnv
};

export default connect(
  null,
  mapDispatchToProps
)(Config);
