import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import Soft from "./Soft";

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
        .sort(v1 => (v1.type === "volume" ? -1 : 1))
        // Display style:
        // - dncore_vpndnpdappnodeeth_data: 866B
        // - /etc/hostname: - (bind)
        .map(({ name, path, size, type }) => ({
          name: name || path || "unknown",
          size: size || (type === "bind" ? "(bind)" : "unknown")
        }))
        .map(({ name, size }) => (
          <>
            <Soft>{name}:</Soft> {size}
          </>
        ))}
    />
  );
}

/**
 * VOLUMES
 * dnp.volumes = [
 *   { type: "bind",
 *     path: "/etc/hostname" },
 *   { type: "volume",
 *     name: "dncore_ethchaindnpdappnodeeth_data",
 *     path: "/var/lib/docker/volumes/dncore_ethchaindnpdappnodeeth_data/_data",
 *     links: "1",
 *     size: "45.13GB"}
 * ]
 */

Vols.propTypes = {
  dnp: PropTypes.shape({
    volumes: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        name: PropTypes.string,
        size: PropTypes.string
      })
    ).isRequired
  }).isRequired
};

export default Vols;
