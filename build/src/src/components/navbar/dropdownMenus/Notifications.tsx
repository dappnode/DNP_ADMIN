import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getNotifications } from "services/notifications/selectors";
import { viewedNotifications } from "services/notifications/actions";
import { PackageNotificationDb } from "types";
// Icons
import Bell from "Icons/Bell";

const Notifications = ({
  notifications,
  viewedNotifications
}: {
  notifications: PackageNotificationDb[];
  viewedNotifications: () => void;
}) => {
  return (
    <BaseDropdown
      name="Notifications"
      messages={notifications}
      Icon={Bell}
      onClick={viewedNotifications}
      moreVisible={true}
      className={"notifications"}
      placeholder="No notifications yet"
    />
  );
};

const mapStateToProps = createStructuredSelector({
  notifications: getNotifications
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { viewedNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
