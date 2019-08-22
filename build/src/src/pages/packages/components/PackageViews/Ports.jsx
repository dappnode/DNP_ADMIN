import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import api from "API/rpcMethods";
import { createStructuredSelector } from "reselect";
// Components
import Card from "components/Card";
import TableInputs from "components/TableInputs";
import Button from "components/Button";
// Utils
import { shortNameCapitalized } from "utils/format";
import { MdAdd } from "react-icons/md";
// Selectors
import { getIsLoadingStrict } from "services/loadingStatus/selectors";
import { getHostPortMappings } from "services/dnpInstalled/selectors";

const maxPortNumber = 32768 - 1;

function getPortsFromDnp(dnp) {
  return (dnp.ports || [])
    .sort((a, b) => a.container - b.container)
    .sort((a, b) =>
      a.deletable && !b.deletable ? 1 : !a.deletable && b.deletable ? -1 : 0
    );
}

function Ports({ dnp, loading, hostPortMapping }) {
  const [ports, setPorts] = useState(getPortsFromDnp(dnp));
  const [updating, setUpdating] = useState(false);
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
     *
     */

    setPorts(getPortsFromDnp(dnp));
    // setEnvs(merge(parseManifestEnvs(dnp.manifest), parseInstalledDnpEnvs(dnp)));
  }, [dnp]);

  async function onUpdateEnvsSubmit() {
    const id = dnp.name;
    try {
      setUpdating(true);
      await api.updatePortMappings(
        { id, portMappings: ports },
        {
          toastMessage: `Updating ${shortNameCapitalized(id)} port mappings...`
        }
      );
    } catch (e) {
      console.error(`Error requesting Backup: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  }

  function addNewPort() {
    setPorts(ps => [
      ...ps,
      { host: "", container: "", protocol: "TCP", deletable: true }
    ]);
  }

  function editPort(i, data) {
    setPorts(ps =>
      ps.map((p, _i) => {
        if (i === _i) return { ...p, ...data };
        else return p;
      })
    );
  }

  function removePort(i) {
    setPorts(ps =>
      ps.filter(({ deletable }, _i) => {
        return _i !== i || !deletable;
      })
    );
  }

  function getDuplicatedContainerPort() {
    const portsObj = {};
    for (const { container, protocol } of ports) {
      if (container) {
        const key = `${container}-${protocol}`;
        if (portsObj[key]) return { container, protocol };
        else portsObj[key] = true;
      }
    }
    return null;
  }

  function getDuplicatedHostPort() {
    const portsObj = {};
    for (const { host, protocol } of ports) {
      if (host) {
        const key = `${host}-${protocol}`;
        if (portsObj[key]) return { host, protocol };
        else portsObj[key] = true;
      }
    }
    return null;
  }

  function getConflictingPort() {
    for (const { host, protocol } of ports) {
      const owner = hostPortMapping[`${host}/${protocol}`];
      if (owner && owner !== dnp.name) return { host, protocol, owner };
    }
  }

  function getPortOverTheMax() {
    return ports.find(
      ({ container, deletable }) => deletable && container > maxPortNumber
    );
  }

  function getArePortsTheSame() {
    function portsToId(_ports) {
      return _ports
        .map(({ host, container, protocol }) =>
          [host, container, protocol].join("")
        )
        .join("");
    }
    return portsToId(dnp.ports) === portsToId(ports);
  }

  const areNewMappingsInvalid = ports.some(
    ({ container, protocol, deletable }) =>
      deletable && (!container || !protocol)
  );
  const duplicatedContainerPort = getDuplicatedContainerPort();
  const duplicatedHostPort = getDuplicatedHostPort();
  const conflictingPort = getConflictingPort();
  const portOverTheMax = getPortOverTheMax();

  const thereAreNewPorts = ports.some(({ deletable }) => deletable);
  const arePortsTheSame = getArePortsTheSame();

  // const envsArray = Object.values(envs).sort(sortByProp("index"));

  // If there are no ENVs don't render the component
  // if (!envsArray.length) return null;

  return (
    <Card spacing>
      <TableInputs
        headers={[
          "Host port",
          "Package port number",
          "Protocol",
          ...(thereAreNewPorts ? [""] : [])
        ]}
        numOfRows={3}
        rowsTemplate={
          thereAreNewPorts
            ? "auto auto minmax(min-content, max-content) min-content"
            : "auto auto minmax(min-content, max-content)"
        }
        content={[
          ...ports.map(({ host, container, protocol, deletable }, i) => [
            {
              placeholder: "ephemeral port (32768-65535)",
              value: host || "",
              onValueChange: value => editPort(i, { host: value })
            },

            deletable
              ? {
                  placeholder: "enter container port...",
                  value: container,
                  onValueChange: value => editPort(i, { container: value })
                }
              : { lock: true, value: container },

            deletable
              ? {
                  select: true,
                  options: ["TCP", "UDP"],
                  value: protocol,
                  onValueChange: value => editPort(i, { protocol: value })
                }
              : { lock: true, value: protocol },

            ...(thereAreNewPorts
              ? [
                  deletable
                    ? { deleteButton: true, onClick: () => removePort(i) }
                    : { empty: true }
                ]
              : [])
          ])
        ]}
      />

      {duplicatedHostPort && (
        <div style={{ color: "red" }}>
          Duplicated mapping for host port {duplicatedHostPort.host}/
          {duplicatedHostPort.protocol}. Each host port can only be mapped once.
        </div>
      )}

      {duplicatedContainerPort && (
        <div style={{ color: "red" }}>
          Duplicated mapping for package port{" "}
          {duplicatedContainerPort.container}/{duplicatedContainerPort.protocol}
          . Each package port can only be mapped once.
        </div>
      )}

      {conflictingPort && (
        <div style={{ color: "red" }}>
          Port {conflictingPort.host}/{conflictingPort.protocol} is already
          mapped by the DAppNode Package{" "}
          {shortNameCapitalized(conflictingPort.owner)}
        </div>
      )}

      {portOverTheMax && (
        <div style={{ color: "red" }}>
          Port mapping {portOverTheMax.container}/{portOverTheMax.protocol} is
          in the ephemeral port range (32768-65535). It must be avoided.
        </div>
      )}

      <div>
        <Button
          variant={"dappnode"}
          onClick={onUpdateEnvsSubmit}
          style={{ float: "left" }}
          disabled={
            areNewMappingsInvalid ||
            duplicatedContainerPort ||
            duplicatedHostPort ||
            conflictingPort ||
            portOverTheMax ||
            arePortsTheSame ||
            updating ||
            loading
          }
        >
          Update port mappings
        </Button>

        <Button
          onClick={addNewPort}
          style={{
            fontSize: "1.5rem",
            display: "flex",
            padding: ".375rem",
            borderColor: "#ced4da",
            float: "right"
          }}
        >
          <MdAdd />
        </Button>
      </div>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  loading: getIsLoadingStrict.dnpInstalled,
  hostPortMapping: getHostPortMappings
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ports);
