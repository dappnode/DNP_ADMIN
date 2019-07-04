import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";
import merge from "deepmerge";
// Components
import Card from "components/Card";
import TableInputs from "components/TableInputs";
import { ButtonLight } from "components/Button";
// Utils
import parseManifestEnvs from "pages/installer/parsers/parseManifestEnvs";
import parseInstalledDnpEnvs from "pages/installer/parsers/parseInstalledDnpEnvs";
import sortByProp from "utils/sortByProp";

function stringifyEnvs(envs) {
  const envsReduced = {};
  for (const { name, value } of Object.values(envs)) {
    envsReduced[name] = value;
  }
  return envsReduced;
}

function Config({ dnp, updateEnvs }) {
  const [envs, setEnvs] = useState({});
  useEffect(() => {
    /**
     * Mix the ENVs from the manifest and the already set on the DNP
     * Also, convert to a nested object notation to retain the order
     * specified in the manifest
     * [NOTE] use deepmerge to preserve the `index` key comming from the manifest
     *
     * const envs = {
     *   "ENV_NAME": {
     *     name: "ENV_NAME",
     *     value: "ENV_VALUE",
     *     index: 0
     *   }
     * }
     */
    setEnvs(merge(parseManifestEnvs(dnp.manifest), parseInstalledDnpEnvs(dnp)));
  }, [dnp]);

  const envsArray = Object.values(envs).sort(sortByProp("index"));

  // If there are no ENVs don't render the component
  if (!envsArray.length) return null;

  return (
    <Card spacing>
      <TableInputs
        headers={["Name", "Value"]}
        content={envsArray.map(({ name, value = "" }) => [
          { lock: true, value: name },
          {
            placeholder: "enter value...",
            value,
            onValueChange: value =>
              setEnvs(envs => ({ ...envs, [name]: { ...envs[name], value } }))
          }
        ])}
      />
      <ButtonLight onClick={() => updateEnvs(dnp.name, stringifyEnvs(envs))}>
        Update environment variables
      </ButtonLight>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  updateEnvs: action.updatePackageEnv
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Config);
