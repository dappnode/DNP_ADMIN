import React from "react";
import { MdCheck, MdClose } from "react-icons/md";

const style = {
  width: "1.35rem",
  height: "1.35rem",
  marginRight: "0.3rem"
};

export default function Ok({ msg, ok }) {
  return (
    <div style={{ display: "flex" }}>
      {ok ? (
        <MdCheck style={style} color="#1ccec0" />
      ) : (
        <MdClose style={style} color="#ff0000" />
      )}
      {msg}
    </div>
  );
}
