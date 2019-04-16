import React from "react";
import { MdCheck, MdClose } from "react-icons/md";
import "./loader-icon.css";

const style = {
  width: "1.35rem",
  height: "1.35rem",
  marginRight: "0.3rem"
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

export default function Ok({ msg, ok, loading }) {
  return (
    <div style={{ display: "flex" }}>
      <span>
        {ok ? (
          <MdCheck style={style} color="#1ccec0" />
        ) : loading ? (
          <LoaderIcon />
        ) : (
          <MdClose style={style} color="#ff0000" />
        )}
      </span>
      <span>{msg}</span>
    </div>
  );
}
