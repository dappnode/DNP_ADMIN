import React, { useState, useEffect } from "react";
import { orderBy, isEmpty } from "lodash";

import Card from "components/Card";
import SubTitle from "components/SubTitle";
import TableInputs from "components/TableInputs";

function EditableTable({ headers, values, setValue }) {
  if (isEmpty(values)) return null;
  const valuesArray = orderBy(
    Object.entries(values).map(([key, value]) => ({ id: key, value })),
    ["id"]
  );
  return (
    <TableInputs
      headers={headers}
      content={valuesArray.map(({ id, value = "" }) => [
        { disabled: true, value: id },
        {
          placeholder: "enter value...",
          value,
          onValueChange: newValue => setValue(x => ({ ...x, [id]: newValue }))
        }
      ])}
    />
  );
}

export default function OldEditor({ dnp }) {
  const [envs, setEnvs] = useState({});
  const [ports, setPorts] = useState({});
  const [vols, setVols] = useState({});

  useEffect(() => {
    setEnvs(dnp.envs);
    setPorts(dnp.ports);
    setVols(dnp.vols);
  }, [dnp]);

  return (
    <Card spacing>
      <EditableTable
        headers={["Env name", "Env value"]}
        values={envs}
        setValue={setEnvs}
      />
      <EditableTable
        headers={["Container port", "Host port"]}
        values={ports}
        setValue={setPorts}
      />
      <EditableTable
        headers={["Container path", "Host path"]}
        values={vols}
        setValue={setVols}
      />
    </Card>
  );
}
