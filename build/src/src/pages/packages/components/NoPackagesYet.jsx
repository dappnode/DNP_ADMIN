import React from "react";
import { Link } from "react-router-dom";
import { rootPath as installerRootPath } from "pages/installer";

const NoPackagesYet = () => (
  <React.Fragment>
    <div className="row justify-content-center mt-5">
      <h4 style={{ opacity: 0.6 }}>No installed DNPs yet</h4>
    </div>
    <div className="row justify-content-center">
      <p style={{ opacity: 0.4 }}>
        If you would like install a DAppNode package (DNP), go to the installer
        tab.
      </p>
    </div>
    <div className="row justify-content-center mb-5">
      <Link
        style={{ color: "inherit", textDecoration: "inherit" }}
        to={installerRootPath}
      >
        <button className="dappnode-pill-gray">Go to Install</button>
      </Link>
    </div>
  </React.Fragment>
);

export default NoPackagesYet;
