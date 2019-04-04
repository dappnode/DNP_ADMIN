import React from "react";

const shadowStyle = { boxShadow: "1px 1px 15px 0 rgba(0, 0, 0, 0.07)" };

const Card = ({ children, className = "", shadow, ...props }) => (
  <div
    style={{ overflowX: "auto", ...(shadow ? shadowStyle : {}) }}
    className="card"
  >
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  </div>
);

export default Card;
