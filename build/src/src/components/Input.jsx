import React from "react";
import onEnterKey from "utils/onEnterKey";
import "./input.css";

const Input = ({
  onEnterPress,
  onValueChange,
  lock,
  prepend,
  append,
  ...props
}) => {
  const input = (
    <input
      type="text"
      className="form-control"
      onChange={e => onValueChange(e.target.value)}
      onKeyPress={onEnterKey(onEnterPress)}
      // Lock props
      readOnly={lock}
      {...props}
    />
  );

  if (prepend)
    return (
      <div className="input-group">
        <div className="input-group-prepend">
          {typeof prepend === "string" ? (
            <span className="input-group-text">{prepend}</span>
          ) : (
            prepend
          )}
        </div>
        {input}
      </div>
    );

  if (append)
    return (
      <div className="input-group">
        {input}
        <div className="input-group-append">
          {typeof append === "string" ? (
            <span className="input-group-text">{append}</span>
          ) : (
            append
          )}
        </div>
      </div>
    );

  return input;
};

export default Input;
