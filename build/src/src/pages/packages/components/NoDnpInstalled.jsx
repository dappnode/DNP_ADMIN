import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// Components
import Button from "components/Button";
// Modules
import { rootPath as installerRootPath } from "pages/installer";
// Utils
import { shortNameCapitalized } from "utils/format";

const NoPackagesYet = ({ id, moduleName }) => (
  <React.Fragment>
    <div className="row justify-content-center mt-5">
      <h4 style={{ opacity: 0.6 }}>{id} is not installed</h4>
    </div>
    <div className="row justify-content-center">
      <p style={{ opacity: 0.4 }}>
        Go back to {moduleName} or click below to install it
      </p>
    </div>
    <div className="row justify-content-center mb-5">
      <Link style={{ margin: "0 10px" }} to={"/" + moduleName}>
        <Button
          variant="outline-secondary"
          style={{ textTransform: "capitalize" }}
        >
          {moduleName}
        </Button>
      </Link>

      <Link style={{ margin: "0 10px" }} to={installerRootPath + "/" + id}>
        <Button variant="outline-secondary">
          Install {shortNameCapitalized(id)}
        </Button>
      </Link>
    </div>
  </React.Fragment>
);

NoPackagesYet.propTypes = {
  id: PropTypes.string.isRequired,
  moduleName: PropTypes.string.isRequired
};

export default NoPackagesYet;