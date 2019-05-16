import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
// Selectors
import {
  getCoreUpdateAvailable,
  getUpdatingCore
} from "services/coreUpdate/selectors";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";

const NotificationsView = ({ coreUpdateAvailable, updatingCore }) => {
  const systemUpdateNotificationId = "systemUpdateNotificationId";
  const systemUpdateNotification = (
    <div
      id={systemUpdateNotificationId}
      className="alert alert-secondary alert-dismissible show"
      role="alert"
    >
      <Link
        className="btn btn-secondary float-right"
        to={systemRootPath + "/" + updatePath}
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
      {coreUpdateAvailable && !updatingCore ? systemUpdateNotification : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  coreUpdateAvailable: getCoreUpdateAvailable,
  updatingCore: getUpdatingCore
});

export default connect(
  mapStateToProps,
  null
)(NotificationsView);
