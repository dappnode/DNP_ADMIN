import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as action from "../../actions";
import merge from "deepmerge";
// Components
import Card from "components/Card";
import TableInputs from "components/TableInputs";
import { ButtonLight } from "components/Button";
// Utils
import parseManifestEnvs from "pages/installer/parsers/parseManifestEnvs";
import parseInstalledDnpEnvs from "pages/installer/parsers/parseInstalledDnpEnvs";
import { sortBy } from "lodash";
import { PackageContainer, PackageEnvs, ManifestWithImage } from "common/types";
import { EnvsVerbose } from "pages/installer/types";

function stringifyEnvs(envs: EnvsVerbose) {
  const envsReduced: PackageEnvs = {};
  for (const { name, value } of Object.values(envs)) {
    envsReduced[name] = value;
  }
  return envsReduced;
}

export default function Config({ dnp }: { dnp: PackageContainer }) {
  const dispatch = useDispatch();
  const [envs, setEnvs] = useState<EnvsVerbose>({});
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
    setEnvs(
      merge(
        parseManifestEnvs(dnp.manifest as ManifestWithImage | undefined),
        parseInstalledDnpEnvs(dnp)
      )
    );
  }, [dnp]);

  const envsArray = sortBy(Object.values(envs), env => env.index);

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
            onValueChange: (value: string) =>
              setEnvs(envs => ({ ...envs, [name]: { ...envs[name], value } }))
          }
        ])}
      />
      <ButtonLight
        onClick={() =>
          dispatch(action.updatePackageEnv(dnp.name, stringifyEnvs(envs)))
        }
      >
        Update environment variables
      </ButtonLight>
    </Card>
  );
}
