import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import api from "API/rpcMethods";
import * as a from "../../actions";
// Components
import Card from "components/Card";
import Input from "components/Input";
import Button from "components/Button";
import Switch from "components/Switch";
// Style
import "./changeHostUserPassword.scss";
import { wifiName } from "params";

function ChangeWifiPassword({ passwordChange }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errorsSsid = [];

  const errors = [];
  if (password && password.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (password.includes("'"))
    errors.push("Password MUST not include the quotes");
  if (!/^([\x20-\x7F])*$/.test(password))
    errors.push("Password must include only simple ASCII characters");

  const errorsConfirm = [];
  if (confirmPassword && confirmPassword !== password)
    errorsConfirm.push("Passwords do not match");

  const invalid =
    !password || !confirmPassword || errors.length || errorsConfirm.length;

  const update = () => {
    if (!invalid)
      api.updatePackageEnv(
        { id: wifiName, envs: {}, restart: true },
        { toastMessage: `Changing WIFI credentials...` }
      );
    passwordChange(password);
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
            className={errors.length ? "is-invalid" : ""}
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

ChangeWifiPassword.propTypes = {
  passwordChange: PropTypes.func.isRequired
};

// Container

const mapStateToProps = null;

const mapDispatchToProps = {
  passwordChange: a.passwordChange
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeWifiPassword);
