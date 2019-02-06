import React from "react";
import Lock from "Icons/Lock";

const lockBackgroundColor = "#f3f3f3"; // very light gray
const lockTextColor = "#737373"; // medium gray
const showLocker = false;

export default function(props) {
  if (props.lock) {
    return (
      <div
        className="form-row mb-3 input-group"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        {showLocker ? (
          <div className="input-group-prepend">
            <span
              className="input-group-text"
              style={{
                borderRightWidth: "0px",
                backgroundColor: lockBackgroundColor,
                paddingRight: "0px"
              }}
            >
              <Lock fill="#bdbdbd" scale={0.8} />
            </span>
          </div>
        ) : null}
        <input
          type="text"
          className="form-control"
          value={props.value}
          readOnly="true"
          style={{
            color: lockTextColor,
            backgroundColor: lockBackgroundColor,
            ...(showLocker ? { borderLeftWidth: "0px" } : {})
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
        <input
          type="text"
          className="form-control"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    );
  }
}
