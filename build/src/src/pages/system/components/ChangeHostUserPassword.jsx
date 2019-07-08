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
// Icons
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// External
import { getPasswordIsInsecure } from "services/dappnodeStatus/selectors";

function ChangeHostUserPassword({ passwordIsInsecure, passwordChange }) {
  const [input, setInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!passwordIsInsecure) return null;

  const errors = [];
  if (input && input.length < 8)
    errors.push("Password must be at least 8 characters long");

  const update = () => {
    if (input && !errors.length) passwordChange(input);
  };

  return (
    <>
      <SubTitle>Change host user password</SubTitle>
      <Card>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="password..."
          value={input}
          onValueChange={setInput}
          onEnterPress={update}
          className={errors.length ? "is-invalid" : ""}
          append={
            <>
              <Button
                onClick={() => setShowPassword(_show => !_show)}
                style={{
                  display: "flex",
                  fontSize: "1.4rem",
                  borderColor: "#ced4da"
                }}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </Button>
              <Button
                variant="dappnode"
                disabled={!input || errors.length}
                onClick={update}
              >
                Change
              </Button>
            </>
          }
        />
        <div className="feedback-error">
          {errors.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
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
