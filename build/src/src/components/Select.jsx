import React from "react";

export default function Select({ options, onValueChange }) {
  return (
    <select
      className="form-control"
      onChange={e => onValueChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
