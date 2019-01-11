import React from "react";
import "./loadingDots.css";

function LoadingDots(props) {
  const size = props.size || 200;
  return (
    <span className="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </span>
  );
}

export default LoadingDots;
