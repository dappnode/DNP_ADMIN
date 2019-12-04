import React from "react";
import "./columns.scss";

/**
 *
 * @param {Object} param0
 * @param {string} [className]
 */
export default function Columns({ children, className, ...props }) {
  return (
    <div className={`columns ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
