import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { NavLink } from "react-router-dom";
import ClipboardJS from "clipboard";
import withTitle from "components/hoc/withTitle";
// Own module
import * as a from "../actions";
import { rootPath } from "../data";
// Services
import { getDeviceById } from "services/devices/selectors";
// Components
import Card from "components/Card";
import Button from "components/Button";
import Input from "components/Input";
import QrCode from "components/QrCode";
import newTabProps from "utils/newTabProps";
// Icons
import { MdOpenInNew } from "react-icons/md";
import { GoClippy } from "react-icons/go";

function DeviceDetails({ device, getDeviceCredentials }) {
  const { id, url, admin } = device;
  console.log({ device });
  useEffect(() => {
    if (!url && id) getDeviceCredentials(id);
  }, [url, id]);

  // Activate the copy functionality
  useEffect(() => {
    new ClipboardJS(".copy");
  }, []);

  return (
    <Card className="device-settings">
      <header>
        <h5 className="card-title">{id || "Device not found"}</h5>

        <NavLink to={rootPath}>
          <Button>Back</Button>
        </NavLink>
      </header>

      {admin && (
        <span
          className={`stateBadge center badge-success`}
          style={{ opacity: 0.85, justifySelf: "left" }}
        >
          ADMIN
        </span>
      )}

      <div className="help-text">
        Open the link below to get access to this device's credentials. You can
        share it with external users to give them access to your DAppNode.
      </div>

      <Input
        disabled={true}
        value={url || ""}
        className="copy-input"
        append={
          <>
            <Button className="copy-input-copy" data-clipboard-text={url}>
              <GoClippy />
            </Button>
            <Button className="copy-input-open">
              <a href={url} {...newTabProps} className="no-a-style">
                <MdOpenInNew />
              </a>
            </Button>
          </>
        }
      />

      <QrCode url={url} width={"400px"} />

      <div className="alert alert-secondary" role="alert">
        Beware of shoulder surfing attacks (unsolicited observers), This QR code
        will grant them access to your DAppNode
      </div>
    </Card>
  );
}

const mapStateToProps = createStructuredSelector({
  device: (state, ownProps) => getDeviceById(state, ownProps.match.params.id),
  // For the withTitle HOC
  subtitle: (_, ownProps) => ownProps.match.params.id
});

const mapDispatchToProps = {
  getDeviceCredentials: a.getDeviceCredentials
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Devices")
)(DeviceDetails);
