import React from "react";

const Card = ({ children, className, ...props }) => (
  <div className="card mb-3">
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  </div>
);

export default Card;
