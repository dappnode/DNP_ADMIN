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
        .sort(v1 => (v1.type === "volume" ? -1 : 1))
        // Order volumes with a bigger size first
        .sort(v1 => ((v1.name || "").includes("data") ? -1 : 0))
        // Display style:
        // - dncore_vpndnpdappnodeeth_data: 866B
        // - /etc/hostname: - (bind)
        .map(({ name, path, size, type }) => ({
          name: name ? prettyVolumeName(name, dnp.name) : path || "Unknown",
          size: size ? prettyBytes(size) : type === "bind" ? "(bind)" : "..."
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
 *     size: 45134817123}
 * ]
 */

Vols.propTypes = {
  dnp: PropTypes.shape({
    volumes: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        name: PropTypes.string,
        size: PropTypes.number
      })
    ).isRequired
  }).isRequired
};

export default Vols;
