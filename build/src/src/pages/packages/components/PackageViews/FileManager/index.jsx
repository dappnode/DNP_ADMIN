import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import To from "./To";
import From from "./From";

function FileManager({ dnp }) {
  const id = dnp.name;
  return (
    <>
      <SubTitle>File Manager</SubTitle>
      <Card>
        <To id={id} />
        <From id={id} />
      </Card>
    </>
  );
}

FileManager.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default FileManager;
