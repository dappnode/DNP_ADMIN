import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import To from "./To";
import From from "./From";

function FileManager({ dnp }) {
  const id = dnp.name;
  return (
    <Card spacing divider className="file-manager">
      <div>
        <div className="subtle-header">Upload file to package</div>
        <To id={id} />
      </div>
      <div>
        <div className="subtle-header">Download file from package</div>
        <From id={id} />
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
