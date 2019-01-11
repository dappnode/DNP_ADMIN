import React from "react";
import { Link } from "react-router-dom";
import installer from "installer";

function NoPackagesYet(props) {
  return (
    <React.Fragment>
      <div className="row justify-content-center mt-5">
        <h4 style={{ opacity: 0.6 }}>No installed DNPs yet</h4>
      </div>
      <div className="row justify-content-center">
        <p style={{ opacity: 0.4 }}>
          If you would like install a DAppNode package (DNP), go to the
          installer tab.
        </p>
      </div>
      <div className="row justify-content-center mb-5">
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          to={"/" + installer.constants.NAME}
        >
          <button
            className="dappnode-pill"
            style={{
              backgroundColor: "#ffffff00",
              width: "max-content",
              borderColor: "black",
              color: "black",
              opacity: 0.3
            }}
          >
            INSTALLER
          </button>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default NoPackagesYet;
