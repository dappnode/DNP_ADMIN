import React from "react";
import Settings from "Icons/Settings";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import system from "system";

class NotificationsView extends React.Component {
  render() {
    const systemUpdateNotification = (
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
    return (
      <div>
        {this.props.systemUpdateAvailable ? systemUpdateNotification : null}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  systemUpdateAvailable: system.selectors.systemUpdateAvailable
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsView);
