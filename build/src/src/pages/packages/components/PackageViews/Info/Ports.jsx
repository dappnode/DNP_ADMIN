import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";

function Ports({ dnp }) {
  let { ports = [], portsToClose = [] } = dnp;
  if (ports && !Array.isArray(ports)) {
    console.error("ports must be an array ", ports);
    ports = [];
  }
  if (portsToClose && !Array.isArray(portsToClose)) {
    console.error("portsToClose must be an array ", portsToClose);
    portsToClose = [];
  }
  return (
    <DataList
      title={"Ports"}
      data={(ports || [])
        .map(portObj => {
          const locked = Boolean(
            (portsToClose || []).find(
              _portObj => String(_portObj.portNumber) === String(portObj.host)
            )
          );
          return { ...portObj, locked };
        })
        .map(({ container, host, protocol, locked }) => (
          <>
            {container} -> {host} {protocol ? protocol.toUpperCase() : protocol}{" "}
            {locked ? <span style={{ opacity: 0.5 }}>(locked)</span> : null}
          </>
        ))}
    />
  );
}

/**
 * PORTS
 * dnp.ports = [{ IP: "0.0.0.0", container: 30304, host: 32770, protocol: "tcp" }, ...]
 * dnp.portsToClose = [{ portNumber: 32771, protocol: "TCP" }, ...]
 */

Ports.propTypes = {
  dnp: PropTypes.shape({
    ports: PropTypes.arrayOf(
      PropTypes.shape({
        container: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        host: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        protocol: PropTypes.string.isRequired
      })
    ).isRequired,
    portsToClose: PropTypes.arrayOf(
      PropTypes.shape({
        portNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        protocol: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default Ports;
