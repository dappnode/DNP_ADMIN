import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode.react";
import withTitle from "components/hoc/withTitle";
// Own module
import * as a from "../actions";
import { rootPath } from "../data";
// Services
import { getDeviceById } from "services/devices/selectors";
// Components
import Card from "components/Card";
import { ButtonLight } from "components/Button";

function DevicesSettings({ device, getDeviceCredentials }) {
  const { id, url } = device;
  useEffect(() => {
    if (!url && id) getDeviceCredentials(id);
  }, [url, id]);

  return (
    <Card className="device-settings">
      <header>
        <h5 className="card-title">{id || "Device not found"}</h5>
        <NavLink to={rootPath}>
          <ButtonLight>Back</ButtonLight>
        </NavLink>
      </header>

      <div className="alert alert-warning" role="alert">
        Beware of shoulder surfing attacks (unsolicited observers), This QR code
        will grant them access to your DAppNode
      </div>

      <div style={{ maxWidth: "400px" }}>
        {url && (
          <QRCode
            value={url}
            renderAs="svg"
            style={{ width: "100%", height: "100%" }}
          />
        )}
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
)(DevicesSettings);
