import React from "react";

const Button = ({ variant, children, pill, ...props }) => (
  <button
    className={`btn btn-${variant} ${pill ? "pill" : ""}`}
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
