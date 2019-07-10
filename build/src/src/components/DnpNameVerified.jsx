import React from "react";
import { GoVerified } from "react-icons/go";
import { shortNameCapitalized, isDnpVerified } from "utils/format";
import "./dnpNameVerified.scss";

export default function DnpNameVerified({ name, big }) {
  return (
    <div className={`dnp-name-verified ${big ? "big" : ""}`}>
      <span className="name">{shortNameCapitalized(name)}</span>
      <span className="verified-badge">
        {isDnpVerified(name) && <GoVerified />}
      </span>
    </div>
  );
}
