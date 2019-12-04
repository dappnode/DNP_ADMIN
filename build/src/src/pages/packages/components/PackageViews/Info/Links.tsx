import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
// Utils
import newTabProps from "utils/newTabProps";
import { MdHome, MdSettingsRemote, MdSettings, MdInfo } from "react-icons/md";
import { PackageContainer } from "types";

function Links({ dnp }: { dnp: PackageContainer }) {
  // In the manifest, homepage = {userui: "http://some.link"}
  const linksObj = dnp.manifest && dnp.manifest.links ? dnp.manifest.links : {};
  const links =
    typeof linksObj === "object"
      ? Object.entries(linksObj)
          .map(([name, url]) => ({ name, url }))
          // Place homepage first
          .sort(l1 => (l1.name === "homepage" ? -1 : 0))
      : typeof linksObj === "string"
      ? [{ name: "homepage", url: linksObj }]
      : [];

  return (
    <DataList
      title={"Links"}
      data={links.map(({ name, url }) =>
        name === "homepage" ||
        name === "ui" ||
        name === "webui" ||
        name === "gateway" ? (
          <a className="links-url" href={url} {...newTabProps}>
            <span className="links-icon">
              {name === "homepage" ? (
                <MdInfo />
              ) : name === "ui" || name === "webui" ? (
                <MdHome />
              ) : name === "gateway" ? (
                <MdSettingsRemote />
              ) : null}
            </span>
            <span>{name}</span>
          </a>
        ) : name === "api" || name === "endpoint" ? (
          <span className="api-link-container">
            <a href={url} {...newTabProps}>
              <span className="links-icon">
                <MdSettings />
              </span>
              <span>Api</span>
            </a>
            <div className="api-link-box">{url}</div>
          </span>
        ) : (
          <a className="unknown-link-container" href={url} {...newTabProps}>
            {name || url || "unnamed"}
          </a>
        )
      )}
    />
  );
}

Links.propTypes = {
  dnp: PropTypes.object.isRequired
};

export default Links;
