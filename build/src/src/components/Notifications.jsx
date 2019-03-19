import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import $ from "jquery";
import system from "system";

const NotificationsView = ({ systemUpdateAvailable, updatingCore }) => {
  const systemUpdateNotificationId = "systemUpdateNotificationId";
  const systemUpdateNotification = (
    <div
      id={systemUpdateNotificationId}
      className="alert alert-warning alert-dismissible show"
      role="alert"
    >
      <Link
        className="btn btn-warning float-right"
        to={`/${system.constants.NAME}/${system.constants.UPDATE}`}
      >
        Update
      </Link>
      <p>
        <strong>DAppNode system update available.</strong> Click{" "}
        <strong>Update </strong>
        to review and approve it
      </p>

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
      {systemUpdateAvailable && !updatingCore ? systemUpdateNotification : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  systemUpdateAvailable: system.selectors.systemUpdateAvailable,
  updatingCore: system.selectors.updatingCore
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsView);
