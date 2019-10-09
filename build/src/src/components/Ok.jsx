import React from "react";
import { MdCheck, MdClose } from "react-icons/md";
import "./loader-icon.css";

const styleIcon = {
  width: "1.35rem",
  height: "1.35rem",
  marginRight: "0.5rem"
};

function LoaderIcon() {
  return (
    <div className="lds-ring">
      <div />
      <div />
      <div />
    </div>
  );
}

export default function Ok({ msg, ok, loading, style, ...props }) {
  return (
    <div style={{ display: "flex", ...style }} {...props}>
      <span>
        {ok ? (
          <MdCheck style={styleIcon} color="#1ccec0" />
        ) : loading ? (
          <LoaderIcon />
        ) : (
          <MdClose style={styleIcon} color="#ff0000" />
        )}
      </span>
      <span>{msg}</span>
    </div>
  );
}
