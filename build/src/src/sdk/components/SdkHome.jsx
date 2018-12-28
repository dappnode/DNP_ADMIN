import React from "react";
import { NavLink } from "react-router-dom";
import Publish from "Icons/Publish";
import { NAME } from "../constants";
import { Link } from "react-router-dom";
import newTabProps from "utils/newTabProps";

const sdkItems = [
  { name: "Publish", href: "publish", icon: Publish },
  { name: "Publish", href: "publish", icon: Publish }
];

const SDK_GUIDE_LINK =
  "https://github.com/dappnode/DAppNodeSDK/wiki/DAppNode-SDK-tutorial";

export default class SdkHome extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";

    const items = sdkItems.map((item, i) => {
      return (
        <div key={i} className="col">
          <NavLink className="nav-link" to={`/${NAME}/${item.href}`}>
            <button
              type="button"
              className="btn btn-outline-dark btn-lg btn-block"
            >
              <div className="text-center" style={{ opacity: 0.6 }}>
                <item.icon scale={2.5} />
              </div>
              <div style={{ fontSize: "16px" }}>{item.name}</div>
            </button>
          </NavLink>
        </div>
      );
    });

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
                  class="alert alert-secondary"
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
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="row">
              <div className="col-sm" style={{ margin, overflow: "hidden" }}>
                <h5 className="card-title" style={{ marginBottom: "3px" }}>
                  Publish DNPs
                </h5>
                <div className="card-text">
                  <span style={{ opacity: "0.5" }}>
                    To Aragon's APM registry
                  </span>
                </div>
              </div>
              <div className="col-sm pkg-row-text" style={{ margin }}>
                <div className="btn-group float-right" role="group">
                  <Link
                    className="btn btn-outline-secondary float-right"
                    to={`/${NAME}/${"publish"}`}
                  >
                    Publish
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
