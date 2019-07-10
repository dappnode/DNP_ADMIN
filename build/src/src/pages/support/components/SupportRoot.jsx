import React from "react";
import withTitle from "components/hoc/withTitle";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { rootPath, title } from "../data";
// Components
import AutoDiagnose from "./AutoDiagnose";
import Report from "./Report";
import Activity from "./Activity";
// Styles
import "./support.css";

function SupportHome() {
  const routes = [
    {
      name: "Auto Diagnose",
      subPath: "auto-diagnose",
      render: () => <AutoDiagnose />
    },
    {
      name: "Report",
      subPath: "report",
      render: () => <Report />
    },
    {
      name: "Activity",
      subPath: "activity",
      render: () => <Activity />
    }
  ].map(route => ({
    ...route,
    path: `${rootPath}/${route.subPath}`,
    to: `${rootPath}/${route.subPath}`
  }));

  return (
    <>
      <div className="horizontal-navbar">
        {routes.map(route => (
          <button key={route.subPath} className="item-container">
            <NavLink
              to={route.to}
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
              path={route.path}
              render={route.render}
            />
          ))}
          {/* Redirect automatically to the first route. DO NOT hardcode 
              to prevent typos and causing infinite loops */}
          <Redirect to={`${rootPath}/${routes[0].subPath}`} />
        </Switch>
      </div>
    </>
  );
}

export default withTitle(title)(SupportHome);
