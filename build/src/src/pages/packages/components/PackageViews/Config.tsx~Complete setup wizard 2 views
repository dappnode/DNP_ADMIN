import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
import { pick } from "lodash";
// Components
import SetupWizard from "pages/installer/components/Steps/SetupWizard/SetupWizard";
// Utils
import { PackageContainer } from "types";

function Config({
  dnp,
  updateEnvs
}: {
  dnp: PackageContainer;
  updateEnvs: () => {};
}) {
  return (
    <SetupWizard
      setupWizard={{
        [dnp.name]: (dnp.setupWizard || []).filter(
          field =>
            field.target.type === "environment" ||
            field.target.type === "portMapping"
        )
      }}
      userSettings={{
        [dnp.name]: pick(dnp.userSettings || {}, [
          "environment",
          "portMappings"
        ])
      }}
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
