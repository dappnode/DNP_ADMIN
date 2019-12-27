import React, { useState } from "react";
import Card from "components/Card";
import { MdDelete } from "react-icons/md";
import { prettyBytes, prettyVolumeNameFromParts } from "utils/format";
import { parseStaticDate } from "utils/dates";
import Badge from "react-bootstrap/Badge";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { VolumeData } from "types";
import "./volumes.scss";
import { joinCssClass } from "utils/css";

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

  const volumesFiltered = volumes
    .sort((v1, v2) => (v2.size || 0) - (v1.size || 0))
    .sort(v1 => (v1.isDangling ? -1 : 1))
    .filter(v => showAll || (v.size || 0) > minSize)
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
          mountpoint,
          createdAt,
          isDangling
        }) => (
          <React.Fragment key={name}>
            <div className="name">
              <span>
                {prettyVolumeNameFromParts({ name, shortName, owner })}
              </span>
              {isDangling && (
                <Badge pill variant="danger">
                  Orphan
                </Badge>
              )}
            </div>
            <div className="size">{prettyBytes(size || 0)}</div>
            {showMountpoint && (
              <div className="mountpoint">{mountpoint || "Host"}</div>
            )}
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
