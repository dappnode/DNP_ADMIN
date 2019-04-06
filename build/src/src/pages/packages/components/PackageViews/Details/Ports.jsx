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
              _portObj => String(_portObj.number) === String(portObj.PublicPort)
            )
          );
          return { ...portObj, locked };
        })
        .map(({ PrivatePort, PublicPort, Type, locked }) => (
          <>
            {PrivatePort} -> {PublicPort} {Type ? Type.toUpperCase() : Type}{" "}
            {locked ? <span style={{ opacity: 0.5 }}>(locked)</span> : null}
          </>
        ))}
    />
  );
}

/**
 * PORTS
 * dnp.ports = [{IP: "0.0.0.0", PrivatePort: 30304, PublicPort: 32770, Type: "tcp"}, ...]
 * dnp.portsToClose = [{number: 32771, type: "TCP"}, ...]
 */

Ports.propTypes = {
  dnp: PropTypes.shape({
    ports: PropTypes.arrayOf(
      PropTypes.shape({
        PrivatePort: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        PublicPort: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Type: PropTypes.string.isRequired
      })
    ).isRequired,
    portsToClose: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default Ports;
