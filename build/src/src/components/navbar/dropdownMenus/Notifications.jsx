import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import * as selector from "navbar/selectors";
import { viewedNotifications } from "navbar/actions";
// Icons
import Bell from "Icons/Bell";

const Notifications = ({ notifications, viewedNotifications }) => {
  return (
    <BaseDropdown
      name="Notifications"
      messages={
        notifications.length
          ? notifications
          : [{ body: "No notifications yet" }]
      }
      Icon={Bell}
      onClick={viewedNotifications}
      moreVisible={true}
      // Right position of the dropdown to prevent clipping on small screens
      offset={"-59px"}
    />
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  viewedNotifications: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  notifications: selector.getNotifications
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { viewedNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
