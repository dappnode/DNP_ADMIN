import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, RouteComponentProps } from "react-router-dom";
import ClipboardJS from "clipboard";
// Own module
import * as a from "../actions";
import { rootPath, title } from "../data";
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
import Title from "components/Title";

export const DeviceDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const id = match.params.id;
  const device = useSelector((state: any) => getDeviceById(state, id));
  const dispatch = useDispatch();

  const { url, admin } = device || {};

  useEffect(() => {
    if (!url && id) dispatch(a.getDeviceCredentials(id));
  }, [url, id, dispatch]);

  // Activate the copy functionality
  useEffect(() => {
    new ClipboardJS(".copy-input-copy");
  }, []);

  const [showQr, setShowQr] = useState(false);

  return (
    <>
      <Title title={title} subtitle={id} />

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
          Open the link below to get access to this device's credentials. You
          can share it with external users to give them access to your DAppNode.
        </div>

        <Input
          lock={true}
          value={url || ""}
          onValueChange={() => {}}
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

        <div className="alert alert-secondary" role="alert">
          Beware of shoulder surfing attacks (unsolicited observers), This QR
          code will grant them access to your DAppNode
        </div>

        <Button onClick={() => setShowQr(!showQr)}>
          {showQr ? "Hide" : "Show"} QR code
        </Button>

        {showQr && url && <QrCode url={url} width={"400px"} />}
      </Card>
    </>
  );
};
