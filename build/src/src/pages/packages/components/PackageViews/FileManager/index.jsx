import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import To from "./To";
import From from "./From";

function FileManager({ dnp }) {
  const id = dnp.name;
  return (
    <Card>
      <To id={id} />
      <From id={id} />
    </Card>
  );
}

FileManager.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default FileManager;
