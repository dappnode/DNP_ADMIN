import React from "react";

import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import To from "./To";
import From from "./From";

/**
 * Additional feature to auto-complete the from and to paths
 * Since it's not critical, errors are logged and ignored
 * @param {string} searchQuery
 */
function fetchParamsFromExtraUrl(searchQuery) {
  try {
    if (!searchQuery) return {};
    const searchParams = new URLSearchParams(searchQuery);
    if (!searchParams) return {};
    return {
      from: searchParams.get("from"),
      to: searchParams.get("to")
    };
  } catch (e) {
    console.error(`Error parsing extra URL: ${e.stack}`);
    return {};
  }
}

function FileManager({ location, dnp }) {
  const id = dnp.name;

  const { from, to } = fetchParamsFromExtraUrl(location.search);

  return (
    <Card spacing divider className="file-manager">
      <div>
        <div className="subtle-header">Upload file to package</div>
        <To id={id} to={to} />
      </div>
      <div>
        <div className="subtle-header">Download file from package</div>
        <From id={id} from={from} />
      </div>
    </Card>
  );
}

FileManager.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default FileManager;
