import React from "react";
import { NAME } from "../constants";

export default class Publish extends React.Component {
  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const id = "Publish";

    const tx = {
      price: "10000000",
      hash: "0x72h4b3hj42j3hvrjh23vjh45v23jg4v23jg4vj234gv"
    };
    return (
      <React.Fragment>
        <div className="section-title">
          <span
            style={{
              opacity: 0.3,
              fontWeight: 300,
              textTransform: "uppercase"
            }}
          >
            {NAME}{" "}
          </span>
          {id}
        </div>

        <div className="section-subtitle">Transaction details</div>
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <p>{tx.price}</p>
                <p>{tx.hash}</p>
              </div>
            </div>
            <div className="border-bottom" />
            <div className="mt-3">
              <div className="float-right">
                <button
                  className="btn dappnode-background-color"
                  onClick={this.approveInstall}
                >
                  PUBLISH
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
