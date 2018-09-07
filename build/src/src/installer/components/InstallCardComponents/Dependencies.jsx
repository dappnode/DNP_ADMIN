import React from "react";
import "./loadBar.css";

export default class Dependencies extends React.Component {
  render() {
    const request = this.props.request;
    let body;
    if (request.fetching) {
      body = (
        <React.Fragment>
          <p style={{ opacity: 0.6 }}>
            <stron>Verifying compatibility...</stron>
          </p>
          <div className="progress">
            <div className="indeterminate" />
          </div>
        </React.Fragment>
      );
    } else if (request.success) {
      body = (
        <React.Fragment>
          <p style={{ color: "#2fbcb2" }}>
            <strong>Compatibile ✓</strong>
          </p>
          <ul>
            {Object.keys(request.success).map((pkg, i) => (
              <li key={i}>
                {pkg +
                  ": " +
                  (request.state[pkg] || "not installed") +
                  " -> " +
                  request.success[pkg]}
              </li>
            ))}
          </ul>
        </React.Fragment>
      );
    } else if (request.errors) {
      body = <p style={{ color: "red" }}>Install request not compatible</p>;
    } else {
      body = <h5>Unkown state</h5>;
    }

    return (
      <React.Fragment>
        <h4 className="card-title">Dependencies</h4>
        {body}
      </React.Fragment>
    );
  }
}
