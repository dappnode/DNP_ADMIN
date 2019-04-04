import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
import { createStructuredSelector } from "reselect";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import TableInputs from "components/TableInputs";
import Button from "components/Button";
// Utils
import parseManifestEnvs from "pages/installer/parsers/parseManifestEnvs";

function parseEnvs(dnp) {
  return {
    ...parseManifestEnvs(dnp.manifest),
    ...(dnp.envs || {})
  };
}

function Envs({ dnp, updateEnvs }) {
  const dnpEnvs = parseEnvs(dnp);
  const [envs, setEnvs] = useState(dnpEnvs);
  useEffect(() => {
    console.log("Setting ENVS");
    setEnvs(dnpEnvs);
  }, [dnp]);
  console.log("Envs", { envs, dnpEnvs });

  if (!Object.keys(dnpEnvs).length) return null;

  return (
    <>
      <SubTitle>Enviroment variables</SubTitle>
      <Card>
        <TableInputs
          headers={["Name", "Value"]}
          content={Object.entries(envs).map(([key, value]) => [
            {
              lock: true,
              value: key
            },
            {
              placeholder: "enter value...",
              value: value || "",
              onValueChange: value => setEnvs({ ...envs, [key]: value })
            }
          ])}
        />
        <Button
          variant="outline-secondary"
          onClick={() => updateEnvs(dnp.name, envs)}
        >
          Update environment variables
        </Button>
      </Card>
    </>
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
)(Envs);
