import React from "react";
import withTitle from "components/hoc/withTitle";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { title } from "../data";
// Components
import AutoDiagnose from "./AutoDiagnose";
import Report from "./Report";
import Activity from "./Activity";
// Styles
import "./support.css";

function SupportRoot({ match }) {
  const routes = [
    {
      name: "Auto Diagnose",
      subPath: "auto-diagnose",
      component: AutoDiagnose
    },
    {
      name: "Report",
      subPath: "report",
      component: Report
    },
    {
      name: "Activity",
      subPath: "activity",
      component: Activity
    }
  ];

  return (
    <>
      <div className="horizontal-navbar">
        {routes.map(route => (
          <button key={route.subPath} className="item-container">
            <NavLink
              to={`${match.url}/${route.subPath}`}
              className="item no-a-style"
              style={{ whiteSpace: "nowrap" }}
            >
              {route.name}
            </NavLink>
          </button>
        ))}
      </div>

      <div className="packages-content">
        <Switch>
          {routes.map(route => (
            <Route
              key={route.subPath}
              path={`${match.path}/${route.subPath}`}
              component={route.component}
            />
          ))}
          {/* Redirect automatically to the first route. DO NOT hardcode 
              to prevent typos and causing infinite loops */}
          <Redirect to={`${match.path}/${routes[0].subPath}`} />
        </Switch>
      </div>
    </>
  );
}

export default withTitle(title)(SupportRoot);
