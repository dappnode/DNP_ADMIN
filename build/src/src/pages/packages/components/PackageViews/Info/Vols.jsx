import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import { Soft } from "./Soft";
import { prettyVolumeName, prettyBytes } from "utils/format";

function Vols({ dnp }) {
  const { volumes = [] } = dnp;
  if (volumes && !Array.isArray(volumes)) {
    console.error("volumes must be an array ", volumes);
    return null;
  }
  return (
    <DataList
      title={"Volumes"}
      data={(volumes || [])
        // Order volumes before bind mounts
        .sort(v1 => (v1.name ? -1 : 1))
        // Order volumes with a bigger size first
        .sort(v1 => ((v1.name || "").includes("data") ? -1 : 0))
        // Display style:
        // - dncore_vpndnpdappnodeeth_data: 866B
        // - /etc/hostname: - (bind)
        .map(({ name, container, size }) => ({
          name: name
            ? prettyVolumeName(name, dnp.name)
            : container || "Unknown",
          size: size ? prettyBytes(size) : !name ? "(bind)" : "..."
        }))
        .map(({ name, size }) => (
          <>
            <Soft>{name}:</Soft> {size}
          </>
        ))}
    />
  );
}

Vols.propTypes = {
  dnp: PropTypes.shape({
    volumes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        container: PropTypes.string,
        size: PropTypes.number
      })
    ).isRequired
  }).isRequired
};

export default Vols;
