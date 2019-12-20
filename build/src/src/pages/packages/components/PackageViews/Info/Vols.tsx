import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import { Soft } from "./Soft";
import { prettyVolumeName, prettyBytes } from "utils/format";
import { PackageContainer } from "types";

function Vols({
  dnp,
  volumesDetail
}: {
  dnp: PackageContainer;
  volumesDetail: {
    [volumeName: string]: {
      size: string; // "823203"
      devicePath: string; // "/dev1/data/dappnode-volumes/bitcoin.dnp.dappnode.eth/data"
      mountpoint?: string; // "/dev1/data"
    };
  };
}) {
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
        .map(({ name, container, size, host }) => {
          const volumeDetail = volumesDetail[name || ""];
          const mountpointSize = volumeDetail ? volumeDetail.size : undefined;
          const mountpoint = volumeDetail ? volumeDetail.mountpoint : undefined;
          return {
            name: name
              ? prettyVolumeName(name, dnp.name)
              : container || "Unknown",
            size: mountpointSize
              ? prettyBytes(parseInt(mountpointSize))
              : typeof size === "number" && !isNaN(size)
              ? prettyBytes(size)
              : !name
              ? "(bind) " + host || ""
              : "...",
            extra: mountpoint ? `(in ${mountpoint})` : undefined
          };
        })
        .map(({ name, size, extra }) => (
          <>
            <Soft>{name}:</Soft> {size} {extra}
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
