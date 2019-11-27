import React from "react";
import { NavLink } from "react-router-dom";
import newTabProps from "utils/newTabProps";
// Items
import { sidenavItems } from "components/navbar/navbarItems";
// styles
import "./home.scss";

const userGuideUrl = "https://dappnode.github.io/DAppNodeDocs/what-can-you-do/";
const surveyUrl = "https://goo.gl/forms/DSy1J1OlQGpdyhD22";

if (!Array.isArray(sidenavItems)) throw Error("sidenavItems must be an array");

export default class Home extends React.Component {
  render() {
    return (
      <>
        <div className="dappnode-home jumbotron">
          <h1 className="display-4">Welcome to DAppNode</h1>
          <p className="lead">
            Visit the user guide to get an overview of how you can do with your
            DAppNode. Also, if you have just finished the installation, please
            let us know how it went; your feedback helps us to improve.
          </p>
          <p className="lead">
            <a
              className="btn btn-dappnode"
              href={userGuideUrl}
              role="button"
              {...newTabProps}
            >
              Read user guide
            </a>

            <a
              className="btn btn-outline-dappnode"
              href={surveyUrl}
              role="button"
              {...newTabProps}
            >
              Give feedback
            </a>
          </p>
        </div>

        <div className="home-links no-a-style">
          {sidenavItems.map(item => (
            <NavLink to={item.href} key={item.href}>
              <button
                type="button"
                className="btn btn-outline-dark btn-lg btn-block"
              >
                <div className="text-center" style={{ opacity: 0.6 }}>
                  <item.icon scale={2} />
                </div>
                <div style={{ fontSize: "16px" }}>{item.name}</div>
              </button>
            </NavLink>
          ))}
        </div>
      </>
    );
  }
}
