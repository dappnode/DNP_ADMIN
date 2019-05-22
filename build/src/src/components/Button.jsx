import React from "react";

const Button = ({ variant, children, pill, className, ...props }) => (
  <button
    className={`btn btn-${variant || "outline-secondary"} ${
      pill ? "pill" : ""
    } ${className || ""}`}
    type="button"
    {...props}
  >
    {children}
  </button>
);

export const ButtonLight = props => (
  <Button variant={"outline-secondary"} {...props}>
    {props.children}
  </Button>
);

export const ButtonDanger = props => (
  <Button variant={"outline-danger"} {...props}>
    {props.children}
  </Button>
);

export default Button;
