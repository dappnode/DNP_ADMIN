import React from "react";
import { NavLink } from "react-router-dom";
// Items
import navbar from "navbar";
// styles
import "./home.css";

const navbarItems = navbar.constants.navbarItems;

const SURVEY_LINK = "https://goo.gl/forms/DSy1J1OlQGpdyhD22";

export default class Home extends React.Component {
  render() {
    const items = navbarItems.map((item, i) => {
      return (
        <div key={i} className="col">
          <NavLink className="nav-link" to={item.href}>
            <button
              type="button"
              className="btn btn-outline-dark btn-lg btn-block"
            >
              <div className="text-center" style={{ opacity: 0.6 }}>
                <item.icon scale={2.5} />
              </div>
              <div style={{ fontSize: "16px" }}>{item.name}</div>
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
              rel="noopener noreferrer"
              target="_blank"
            >
              Fill survey
            </a>
          </p>
        </div>

        <div className="row mt-4">{items}</div>
      </div>
    );
  }
}
