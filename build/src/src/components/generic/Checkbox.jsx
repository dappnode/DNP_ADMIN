import React from "react";
import PropTypes from "prop-types";
import "./checkbox.css";

function Checkbox({ checked, onChange }) {
  const id = String(Math.random()).slice(2);
  return (
    <React.Fragment>
      <input
        id={id}
        className="checkbox"
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <label htmlFor={id} />
    </React.Fragment>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
