import React from "react";
import "./columns.scss";

export default function Columns({ children, className, ...props }) {
  return (
    <div className={`columns ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
