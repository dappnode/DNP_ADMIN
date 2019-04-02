import React from "react";

const Button = ({ variant, children, ...props }) => (
  <button className={`btn btn-${variant}`} type="button" {...props}>
    {children}
  </button>
);

export default Button;
