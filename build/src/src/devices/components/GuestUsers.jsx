import React from "react";
import ClipboardJS from "clipboard";
import { NavLink } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { guestsName, guestsIpRange } from "../constants";

new ClipboardJS(".btn");

export default class GuestUsers extends React.Component {
  resetGuestUsersPassword() {
    confirmAlert({
      title: "Reseting guests users password",
      message:
        "All previous guests will lose access to this DAppNode. Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.props.resetGuestUsersPassword()
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  render() {
    const guestUsersDevice = this.props.guestUsersDevice;
    const guestsUsersEnabled = Boolean(guestUsersDevice);
    const device = {
      ...(guestUsersDevice || {}),
      name: guestsName,
      ip: guestsIpRange
    };

    let url = device.url || "";
    let id = device.name || "";
    let ip = device.ip || "";

    const margin = "5px";
    const padding = "0.7rem";
    const width = "108px";

    return (
      <React.Fragment>
        <div className="section-subtitle">Guest users</div>

        <div className="card mb-3" id={id}>
          <div className="card-body" style={{ padding }}>
            <div>
              <div className="float-left" style={{ margin, width: "170px" }}>
                <h5 className="card-title">{id}</h5>
                <p className="card-text">{ip}</p>
              </div>
              <div>
                {guestsUsersEnabled ? (
                  <React.Fragment>
                    <div
                      className="btn-group float-right"
                      role="group"
                      style={{ margin }}
                    >
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        style={{ width }}
                        id={id}
                        onClick={this.resetGuestUsersPassword.bind(this)}
                      >
                        Reset
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        style={{
                          width,
                          paddingLeft: "0px",
                          paddingRight: "0px"
                        }}
                        // Sending disabling = true, to know when the guest users
                        // are being disabled in order to show a notification
                        // Handled at Devices.jsx
                        onClick={this.props.toggleGuestUsers.bind(this, true)}
                      >
                        Disable
                      </button>
                    </div>
                    <div
                      className="btn-group float-right"
                      role="group"
                      style={{ margin }}
                    >
                      <NavLink to={"/devices/" + id}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          style={{
                            width,
                            borderBottomRightRadius: "0px",
                            borderTopRightRadius: "0px",
                            borderRightColor: "white",
                            position: "relative",
                            left: "1px"
                          }}
                          disabled={!guestsUsersEnabled}
                        >
                          Show QR
                        </button>
                      </NavLink>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        style={{ width }}
                        data-clipboard-text={url}
                        disabled={!guestsUsersEnabled}
                      >
                        Copy link
                      </button>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      className="btn-group float-right"
                      role="group"
                      style={{ margin }}
                    >
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        style={{
                          width,
                          paddingLeft: "0px",
                          paddingRight: "0px"
                        }}
                        // Sending disabling = false, to know when the guest users
                        // are being disabled in order to show a notification
                        // Handled at Devices.jsx
                        onClick={this.props.toggleGuestUsers.bind(this, false)}
                      >
                        Enable
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
