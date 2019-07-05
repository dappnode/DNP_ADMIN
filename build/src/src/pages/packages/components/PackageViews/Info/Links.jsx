import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import Soft from "./Soft";
// Utils
import newTabProps from "utils/newTabProps";

function Links({ dnp }) {
  const { manifest = {} } = dnp;
  // In the manifest, homepage = {userui: "http://some.link"}
  const linksObj = manifest.links || manifest.homepage || {};
  const links =
    typeof linksObj === "object"
      ? Object.keys(linksObj).map(name => ({
          name,
          url: linksObj[name]
        }))
      : typeof linksObj === "string"
      ? [{ name: "homepage", url: linksObj }]
      : [];
  return (
    <DataList
      title={"Link"}
      data={links.map(({ name, url }) => (
        <>
          <Soft>{name || "unnamed"}:</Soft>{" "}
          <a href={url} {...newTabProps}>
            {url}
          </a>
        </>
      ))}
    />
  );
}

Links.propTypes = {
  dnp: PropTypes.object.isRequired
};

export default Links;
