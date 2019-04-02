import React from "react";
import onEnterKey from "utils/onEnterKey";
import "./input.css";

const Input = ({ onEnterPress, onValueChange, lock, prepend, ...props }) => {
  const input = (
    <input
      type="text"
      className={"form-control" + (lock ? " lock" : "")}
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
          <span className="input-group-text">{prepend}</span>
        </div>
        {input}
      </div>
    );
  else return input;
};

export default Input;
