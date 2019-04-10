import React from "react";
import errorImg from "img/error-min.png";

function Error(props) {
  const size = props.size || 200;
  return (
    <div className="vertical-container-centered">
      <div className="mb-5 mt-5">
        <h4 style={{ opacity: 0.6 }}>{props.msg}</h4>
      </div>
      <img width={size} height={size} src={errorImg} alt="loading..." />
    </div>
  );
}

export default Error;
