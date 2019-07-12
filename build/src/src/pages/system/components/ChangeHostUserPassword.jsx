import React, { useState } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as a from "../actions";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Input from "components/Input";
import Button from "components/Button";
import Switch from "components/Switch";
// External
import { getPasswordIsInsecure } from "services/dappnodeStatus/selectors";

function ChangeHostUserPassword({ passwordIsInsecure, passwordChange }) {
  const [input, setInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!passwordIsInsecure) return null;

  const errors = [];
  if (input && input.length < 8)
    errors.push("Password must be at least 8 characters long");

  const errorsConfirm = [];
  if (confirmInput && confirmInput !== input)
    errorsConfirm.push("Passwords do not match");

  const invalid =
    !input || !confirmInput || errors.length || errorsConfirm.length;

  const update = () => {
    if (!invalid) passwordChange(input);
  };

  return (
    <>
      <SubTitle>Change host user password</SubTitle>
      <Card className="change-password-form">
        <span>New password</span>
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="password..."
            value={input}
            onValueChange={setInput}
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
            value={confirmInput}
            onValueChange={setConfirmInput}
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
      </Card>
    </>
  );
}

ChangeHostUserPassword.propTypes = {
  passwordIsInsecure: PropTypes.bool.isRequired,
  passwordChange: PropTypes.func.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  passwordIsInsecure: getPasswordIsInsecure
});

const mapDispatchToProps = {
  passwordChange: a.passwordChange
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeHostUserPassword);
