import React from "react";
import "./loadBar.css";

export default class Dependencies extends React.Component {
  render() {
    const request = this.props.request;
    let body;
    if (!Object.keys(request).length) {
      body = <p>Empty request</p>;
    } else if (request.fetching) {
      body = (
        <React.Fragment>
          <p style={{ opacity: 0.6 }}>
            <strong>Verifying compatibility...</strong>
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
            <strong>✓ Compatible</strong>
          </p>
          <div className="row">
            <div className="col-4" />
            <div className="col-4">Current version</div>
            <div className="col-4">Requested version</div>
          </div>
          {Object.keys(request.success).map((pkg, i) => (
            <div key={i} className="row">
              <div className="col-4 text-truncate">{pkg}</div>
              <div className="col-4 text-truncate">
                {request.state[pkg] || "not installed"}
              </div>
              <div className="col-4 text-truncate">{request.success[pkg]}</div>
            </div>
          ))}
        </React.Fragment>
      );
    } else if (request.errors) {
      body = (
        <p style={{ color: "#d50f0fd1" }}>✕ Install request not compatible</p>
      );
    } else {
      body = (
        <p style={{ color: "#d50f0fd1" }}>
          ✕ Something went wrong, broken request object{" "}
          {JSON.stringify(request)}
        </p>
      );
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Dependencies</div>
        <div className="card mb-4">
          <div className="card-body">{body}</div>
        </div>
      </React.Fragment>
    );
  }
}
