import React from "react";

export default function Select({ value, options, onValueChange }) {
  return (
    <select
      className="form-control"
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
