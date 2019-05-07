import React from "react";
import "./switch.css";

const Switch = ({ checked, onToggle, label, id, ...props }) => {
  if (!id) id = String(Math.random()).slice(2);
  return (
    <span className="switch switch-sm">
      <input
        type="checkbox"
        className="switch"
        id={id}
        checked={checked}
        onChange={() => onToggle(!checked)}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </span>
  );
};

export default Switch;
