import React from "react";
import Input from "components/Input";

const lockBackgroundColor = "#f3f3f3"; // very light gray
const lockTextColor = "#737373"; // medium gray

export default function({ lock, ...props }) {
  if (lock) {
    return (
      <div
        className="form-row mb-3 input-group"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Input
          {...props}
          readOnly={true}
          style={{
            color: lockTextColor,
            backgroundColor: lockBackgroundColor
          }}
        />
      </div>
    );
  } else {
    return (
      <div
        className="form-row mb-3 input-group"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Input {...props} />
      </div>
    );
  }
}
