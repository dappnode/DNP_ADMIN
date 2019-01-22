import React from "react";
import { NAME } from "../constants";
import { Link } from "react-router-dom";
import newTabProps from "utils/newTabProps";

const SDK_GUIDE_LINK =
  "https://github.com/dappnode/DAppNodeSDK/wiki/DAppNode-SDK-tutorial";

const subRoutes = [
  {
    title: "Publish DNPs",
    subtitle: `To an Aragon's APM registry`,
    route: "publish"
  }
  // {
  //   title: "Explore repos",
  //   subtitle: `Of Aragon's APM registries`,
  //   route: "explore"
  // }
];

export default class SdkHome extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";

    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "uppercase" }}>
          {NAME}
        </div>

        <div className="section-subtitle">What is the SDK?</div>
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="row">
              <div className="col" style={{ margin, overflow: "hidden" }}>
                <p>
                  The DAppNode Software Development Kit (dappnodesdk) is a tool
                  to make as simple as possible the creation of new dappnode
                  packages. It helps to initialize and publish an Aragon Package
                  Manager Repo in the ethereum mainnet.
                </p>
                <p>
                  We have deployed a public APM (Aragon Package Manager)
                  registry in which anyone can create their own APM repository:{" "}
                  <a href="https://etherscan.io/address/public.dappnode.eth">
                    public.dappnode.eth
                  </a>
                </p>
                <div
                  className="alert alert-secondary"
                  role="alert"
                  style={{ backgroundColor: "#f1f1f3" }}
                >
                  The <strong>dappnodesdk</strong> is a{" "}
                  <strong>CLI tool</strong>. This section provides only
                  additional complimentary functionality
                </div>
                <p>
                  The dappnodesdk can be installed locally with npm. Then you
                  can initialize a DNP, build it's docker image and publish it
                  on the Aragon Package Manager (APM) on the ethereum mainnet
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col" style={{ margin, overflow: "hidden" }}>
                <a
                  className="btn btn-outline-secondary float-right"
                  href={SDK_GUIDE_LINK}
                  {...newTabProps}
                >
                  Full Guide
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="section-subtitle">What can I the SDK do?</div>
        {subRoutes.map(({ title, subtitle, route }) => (
          <div key={route} className="card mb-3">
            <div className="card-body" style={{ padding }}>
              <div className="row">
                <div className="col-sm" style={{ margin, overflow: "hidden" }}>
                  <h5 className="card-title" style={{ marginBottom: "3px" }}>
                    {title}
                  </h5>
                  <div className="card-text">
                    <span style={{ opacity: "0.5" }}>{subtitle}</span>
                  </div>
                </div>
                <div className="col-sm pkg-row-text" style={{ margin }}>
                  <div className="btn-group float-right" role="group">
                    <Link
                      className="btn btn-outline-secondary float-right"
                      to={`/${NAME}/${route}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {route}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }
}
