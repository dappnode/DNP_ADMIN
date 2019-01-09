import React from "react";

// MdPublish

export default function(props) {
  const scale = props.scale || 1;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24 * scale}
      height={24 * scale}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
    </svg>
  );
}
