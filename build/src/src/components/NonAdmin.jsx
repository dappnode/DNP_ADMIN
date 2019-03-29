import React from "react";
import logo from "img/dappnode-logo-wide-min.png";
import "./nonAdmin.css";

const NonAdmin = () => (
  <div className="standalone-container">
    <div className="title">Snap! You are not an admin</div>
    <div className="text">
      This website is reserved to the DAppNode admin. Your VPN profile must have
      admin priviledges. Please contact this DAppNode's admin to get access.
    </div>
    <div className="separator" />
    <img className="logo" src={logo} alt="logo" />
  </div>
);

export default NonAdmin;
