import React from "react";
import { title, rootPath, updatePath, securityPath } from "../data";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
// Components
import StaticIp from "./StaticIp";
import AutoUpdates from "./AutoUpdates";
import Security from "./Security";
import PowerManagment from "./PowerManagment";
import SystemUpdate from "./SystemUpdate";
import Peers from "./Peers";
import Identity from "./Identity";
import SystemInfo from "./SystemInfo";
import Title from "components/Title";
import Card from "components/Card";

function SystemHome() {
  /**
   * Construct all subroutes to iterate them both in:
   * - Link (to)
   * - Route (render, path)
   */
  const availableRoutes = [
    // {
    //   name: "Info",
    //   subPath: "info",
    //   component: SystemInfo
    // },
    {
      name: "Identity",
      subPath: "identity",
      component: Identity
    },
    {
      name: "Security",
      subPath: securityPath,
      component: Security
    },
    {
      name: "Auto updates",
      subPath: "auto-updates",
      component: AutoUpdates
    },
    {
      name: "Static IP",
      subPath: "static-ip",
      component: StaticIp
    },
    {
      name: "Update",
      subPath: updatePath,
      component: SystemUpdate
    },
    {
      name: "Peers",
      subPath: "peers",
      component: Peers
    },
    {
      name: "Power",
      subPath: "power",
      component: PowerManagment
    }
  ];

  return (
    <>
      <Title title={title} />

      <div className="horizontal-navbar">
        {availableRoutes.map(route => (
          <button key={route.subPath} className="item-container">
            <NavLink
              to={`${rootPath}/${route.subPath}`}
              className="item no-a-style"
              style={{ whiteSpace: "nowrap" }}
            >
              {route.name}
            </NavLink>
          </button>
        ))}
      </div>

      <div className="section-spacing">
        <Switch>
          {availableRoutes.map(route => (
            <Route
              key={route.subPath}
              path={`${rootPath}/${route.subPath}`}
              component={route.component}
            />
          ))}
          {/* Redirect automatically to the first route. DO NOT hardcode 
              to prevent typos and causing infinite loops */}
          {/* <Redirect to={`${rootPath}/${availableRoutes[0].subPath}`} /> */}
          <Route
            render={() => (
              <Card>
                {availableRoutes.map(route => (
                  <li key={route.subPath}>
                    <NavLink to={`${rootPath}/${route.subPath}`}>
                      {route.name}
                    </NavLink>
                  </li>
                ))}
              </Card>
            )}
          />
        </Switch>
      </div>
    </>
  );
}

export default SystemHome;
