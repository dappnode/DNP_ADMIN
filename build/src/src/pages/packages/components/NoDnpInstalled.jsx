import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
        You can go back to the {moduleName} or if you would like install it, go
        to the installer tab.
      </p>
    </div>
    <div className="row justify-content-center mb-5">
      <Link style={{ margin: "0 10px" }} to={"/" + moduleName}>
        <button className="dappnode-pill-gray">{moduleName}</button>
      </Link>

      <Link style={{ margin: "0 10px" }} to={installerRootPath + "/" + id}>
        <button className="dappnode-pill-gray">
          Install {shortNameCapitalized(id)}
        </button>
      </Link>
    </div>
  </React.Fragment>
);

NoPackagesYet.propTypes = {
  id: PropTypes.string.isRequired,
  moduleName: PropTypes.string.isRequired
};

export default NoPackagesYet;
