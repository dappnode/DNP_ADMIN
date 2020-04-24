import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import apiUntyped from "API/rpcMethods";
import { wifiName, wifiEnvSSID, wifiEnvWPA_PASSPHRASE } from "params";
// Components
import Card from "components/Card";
import Input from "components/Input";
import Button from "components/Button";
import Switch from "components/Switch";
// Style
import "./changeHostUserPassword.scss";
import { getWifiCredentials } from "services/dnpInstalled/selectors";

const api: any = apiUntyped;

function ChangeWifiPassword({
  wifiCredentials
}: {
  wifiCredentials: { ssid: string; pass: string } | null;
}) {
  const prevSsid = (wifiCredentials || {}).ssid || "";
  const [ssid, setSsid] = useState(prevSsid);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (prevSsid) setSsid(prevSsid);
  }, [prevSsid]);

  const errorsSsid: string[] = [];

  const errors: string[] = [];
  if (password && password.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (password.includes("'"))
    errors.push("Password must not include the quotes");
  if (password.includes("$"))
    errors.push("Password must not include the $ character");
  if (!/^([\x20-\x7F])*$/.test(password))
    errors.push("Password must include only simple ASCII characters");

  const errorsConfirm = [];
  if (confirmPassword && confirmPassword !== password)
    errorsConfirm.push("Passwords do not match");

  const invalid =
    !password ||
    !confirmPassword ||
    errorsSsid.length > 0 ||
    errors.length > 0 ||
    errorsConfirm.length > 0;

  const update = () => {
    const envs = {
      [wifiEnvSSID]: ssid,
      [wifiEnvWPA_PASSPHRASE]: password
    };
    if (!invalid)
      api
        .updatePackageEnv(
          { id: wifiName, envs, restart: true },
          { toastMessage: `Changing WIFI credentials...` }
        )
        .catch((e: Error) => {
          console.error(`Error on api.updatePackageEnv`, e);
        });
  };

  return (
    <Card spacing>
      <div>
        Please change the WIFI credentials. The current password is the factory
        insecure default. Changing it to a strong password will protect your
        DAppNode from external attackers.
      </div>

      <div className="change-password-form">
        <span>SSID</span>
        <div>
          <Input
            type="text"
            placeholder="ssid..."
            value={ssid}
            onValueChange={setSsid}
            onEnterPress={update}
            className={errorsSsid.length ? "is-invalid" : ""}
          />
          <div className="feedback-error">
            {errorsSsid.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>

        <span>New password</span>
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="password..."
            value={password}
            onValueChange={setPassword}
            onEnterPress={update}
            className={errors.length ? "is-invalid" : ""}
          />
          <div className="feedback-error">
            {errors.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>

        <span>Confirm</span>
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="password..."
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            onEnterPress={update}
            className={errorsConfirm.length ? "is-invalid" : ""}
          />
          <div className="feedback-error">
            {errorsConfirm.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>

        <span className="separator" />
        <div className="toggle">
          <Switch
            checked={showPassword}
            onToggle={() => setShowPassword(_show => !_show)}
            label={"Show my password"}
            id={"switch-password-visibility"}
          />
        </div>

        <span className="separator" />
        <div className="submit-buttons">
          <Button variant="dappnode" disabled={invalid} onClick={update}>
            Change
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  wifiCredentials: getWifiCredentials
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeWifiPassword);
