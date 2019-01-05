import React from "react";
import logoAnimated from "img/dappNodeAnimation.gif";

function Loading(props) {
  const size = props.size || 200;
  return (
    <React.Fragment>
      <div className="row justify-content-center mb-5 mt-5">
        <h4 style={{ opacity: 0.6 }}>{props.msg}</h4>
      </div>
      <div className="row justify-content-center">
        <img width={size} height={size} src={logoAnimated} alt="loading..." />
      </div>
    </React.Fragment>
  );
}

export default Loading;
