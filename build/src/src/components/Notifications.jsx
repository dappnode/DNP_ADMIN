import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import system from "system";

class NotificationsView extends React.Component {
  render() {
    const systemUpdateNotification = (
      <div
        className="alert alert-warning alert-dismissible fade show"
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
