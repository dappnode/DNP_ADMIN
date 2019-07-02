import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Get from "./Get";
import Restore from "./Restore";

function Backup({ dnp }) {
  const backup = [
    {
      name: "modules",
      path: "/usr/src/app/node_modules"
    },
    {
      name: "src",
      path: "/usr/src/app/src"
    },
    {
      name: "secrets",
      path: "/usr/src/app/secrets"
    },
    {
      name: "etc",
      path: "/usr/src/app/etc"
    }
  ];

  const id = dnp.name;
  return (
    <>
      <SubTitle>Backup</SubTitle>
      <Card>
        <Get {...{ id, backup }} />
        <Restore {...{ id, backup }} />
      </Card>
    </>
  );
}

Backup.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Backup;
