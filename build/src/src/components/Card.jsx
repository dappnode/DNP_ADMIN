import React from "react";

const shadowStyle = { boxShadow: "1px 1px 15px 0 rgba(0, 0, 0, 0.07)" };

/**
 * [NOTE] style is injected to the card-body div via ...props
 */
const Card = ({ children, className = "", shadow, spacing, ...props }) => (
  <div
    style={{ overflowX: "auto", ...(shadow ? shadowStyle : {}) }}
    className="card"
  >
    <div
      className={`card-body ${spacing ? "spacing" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  </div>
);

export default Card;
