import React, { useState } from "react";
import Card from "components/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import { MdExpandMore, MdExpandLess, MdDelete } from "react-icons/md";
import { MountpointDataView } from "pages/installer/components/Steps/SelectMountpoint";
import { prettyBytes, prettyVolumeNameFromParts } from "utils/format";
import { parseStaticDate } from "utils/dates";
import { joinCssClass } from "utils/css";
import { VolumeData } from "types";
import "./volumes.scss";

const shortLength = 3;
const minSize = 10 * 1024 * 1024;

export default function VolumesGrid({
  volumes,
  volumeRemove
}: {
  volumes: VolumeData[];
  volumeRemove: (name: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const getSize = (v: VolumeData) => v.size || (v.fileSystem || {}).used || 0;
  const volumesFiltered = volumes
    .sort((v1, v2) => getSize(v2) - getSize(v1))
    .sort((v1, v2) => (v1.isDangling && !v2.isDangling ? -1 : 1))
    .filter(v => showAll || getSize(v) > minSize)
    .slice(0, showAll ? volumes.length : shortLength);

  // Optimize the view hidding features when no element is using them
  const showRemove = showAll || volumesFiltered.some(v => v.isDangling);
  const showMountpoint = showAll || volumesFiltered.some(v => v.mountpoint);

  return (
    <Card
      className={
        "list-grid volumes " + joinCssClass({ showRemove, showMountpoint })
      }
    >
      <header>Name</header>
      <header className="center">Size</header>
      {showMountpoint && <header className="center">Mountpoint</header>}
      <header className="center">Created at</header>
      {showRemove && <header>Remove</header>}

      {volumesFiltered.map(
        ({
          name,
          shortName,
          owner,
          size,
          fileSystem,
          createdAt,
          isDangling
        }) => (
          <React.Fragment key={name}>
            <div className="name">
              <span className="text">
                {prettyVolumeNameFromParts({ name, shortName, owner })}
              </span>
              {isDangling && (
                <Badge pill variant="danger">
                  Orphan
                </Badge>
              )}
            </div>
            <div className="size">
              {!size && fileSystem ? (
                <OverlayTrigger
                  placement="right"
                  overlay={(props: any) => (
                    <Tooltip {...props}>
                      Can't get the exact volume size, use the mountpoint total
                      size as an approximate upper reference
                    </Tooltip>
                  )}
                >
                  <span className="opacity-soft">N/A</span>
                </OverlayTrigger>
              ) : (
                prettyBytes(size || 0)
              )}
            </div>
            {showMountpoint &&
              (fileSystem ? (
                <MountpointDataView
                  fileSystem={fileSystem}
                ></MountpointDataView>
              ) : (
                "Docker volume"
              ))}
            <div className="created-at">{parseStaticDate(createdAt, true)}</div>
            {showRemove && (
              <MdDelete
                className={isDangling ? "" : "disabled"}
                onClick={() => (isDangling ? volumeRemove(name) : null)}
              />
            )}
            <hr />
          </React.Fragment>
        )
      )}
      <div className="subtle-header" onClick={() => setShowAll(x => !x)}>
        {showAll ? <MdExpandLess /> : <MdExpandMore />}
        <span>Show {showAll ? "less" : "all"}</span>
      </div>
    </Card>
  );
}
