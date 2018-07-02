import React from "react";
import { NavLink } from "react-router-dom";
// Modules
import chains from "chains";
// Icons
import Devices from "./Icons/Devices";
import Dashboard from "./Icons/Dashboard";
import Folder from "./Icons/Folder";
import NewFolder from "./Icons/NewFolder";

const SURVEY_LINK = "https://goo.gl/forms/DSy1J1OlQGpdyhD22";

let navbarItemsInfo = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Dashboard
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Devices
  },
  {
    name: "Installer",
    href: "/installer",
    icon: NewFolder
  },
  {
    name: "Packages",
    href: "/packages",
    icon: Folder
  }
];

export default class Home extends React.Component {
  render() {
    const items = navbarItemsInfo.map((item, i) => {
      return (
        <div key={i} className="col">
          <NavLink className="nav-link" to={item.href}>
            <button
              type="button"
              className="btn btn-outline-dark btn-lg btn-block"
            >
              <div className="nav-link-icon">
                <item.icon scale={2.5} />
              </div>
              <div>{item.name}</div>
            </button>
          </NavLink>
        </div>
      );
    });

    return (
      <div className="body">
        <div className="jumbotron">
          <h1 className="display-4">Welcome to DAppNode</h1>
          <p className="lead">
            If you have just finished the installation, please help the team
            telling us how it went in the survey below
          </p>
          <p className="lead">
            <a
              className="btn dappnode-background-color btn-lg"
              href={SURVEY_LINK}
              role="button"
            >
              Fill survey
            </a>
          </p>
        </div>

        <chains.components.ChainStatusLog />

        <div className="row mt-4">{items}</div>
      </div>
    );
  }
}
