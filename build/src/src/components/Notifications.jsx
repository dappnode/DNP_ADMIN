import React from "react";
import Settings from "Icons/Settings";

export default class Notifications extends React.Component {
  render() {
    return (
      <div
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <strong>DAppNode System Update Available.</strong> Go to the{" "}
        <span style={{ position: "relative", top: "6px" }}>
          <Settings />
        </span>
        <strong>System</strong> tab to review and approve the update
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}
