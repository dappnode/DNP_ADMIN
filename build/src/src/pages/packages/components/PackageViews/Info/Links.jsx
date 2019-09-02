import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import { SoftCapitalized } from "./Soft";
// Utils
import newTabProps from "utils/newTabProps";
import { MdHome, MdSettingsRemote, MdSettings, MdInfo } from "react-icons/md";

function Links({ dnp }) {
  const { manifest = {} } = dnp;
  // In the manifest, homepage = {userui: "http://some.link"}
  const linksObj = manifest.links || manifest.homepage || {};
  const links =
    typeof linksObj === "object"
      ? Object.entries(linksObj)
          .map(([name, url]) => ({
            name,
            url
          }))
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
            {name}
          </a>
        ) : name === "api" || name === "endpoint" ? (
          <span>
            <a href={url} {...newTabProps}>
              <span className="links-icon">
                <MdSettings />
              </span>
              Api
            </a>
            <span className="api-link-box">{url}</span>
          </span>
        ) : (
          <span>
            <SoftCapitalized>{name || "unnamed"}:</SoftCapitalized>{" "}
            <a href={url} {...newTabProps}>
              {url}
            </a>
          </span>
        )
      )}
    />
  );
}

Links.propTypes = {
  dnp: PropTypes.object.isRequired
};

export default Links;
