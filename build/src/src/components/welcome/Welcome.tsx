import React, { useState, useEffect } from "react";
import * as api from "API/calls";
import WelcomeHome from "./WelcomeHome";
import Repository from "./Repository";
import AutoUpdates from "./AutoUpdates";
import ChangeHostPassword from "./ChangeHostPassword";
import Finished from "./Finished";
// styles
import "./welcome.scss";
import { joinCssClass } from "utils/css";

// Matches the value in welcome.scss
const transitionMs = 300;

type RouteId = "repository" | "auto-updates" | "change-host-password";

/**
 * This internal Welcome status allows to freeze routeIds
 * routeIds must be frozen during a welcome wizard flow so the user
 * can go back and next without the views changing or disapearing
 */
type Status = "active" | "finished";

/**
 * Track the internal status of the opacity of the welcome container
 */
type FadeStatus = "null" | "opacity-0" | "opacity-1";

interface RouteProps {
  onBack: () => void;
  onNext: () => void;
}

/**
 * Return a view for each routeId
 * RouteIds will be returned by the DAPPMANAGER is a correct order
 */
function getRouteIdComponent(
  routeId: RouteId
): React.FunctionComponent<RouteProps> | undefined {
  switch (routeId) {
    case "auto-updates":
      return (props: RouteProps) => <AutoUpdates {...props} />;
    case "change-host-password":
      return (props: RouteProps) => <ChangeHostPassword {...props} />;
    case "repository":
      return (props: RouteProps) => <Repository {...props} />;
    default:
      return undefined;
  }
}

// Assume that on each page you go next by calling the DAPPMANAGER

/**
 * Handles routing and each subroute should have "Next" & "Back"
 */
export function Welcome() {
  const [routeN, setRouteN] = useState(0);
  const [status, setStatus] = useState<Status>("finished");
  // routeIds must be frozen during a welcome wizard flow so the user
  // can go back and next without the views changing or disapearing
  const [routeIds, setRouteIds] = useState<RouteId[]>([]);
  const [externalRouteIds, setExternalRouteIds] = useState<RouteId[]>([
    "repository",
    "change-host-password"
  ]);

  const routes: {
    id: RouteId;
    render: React.FunctionComponent<RouteProps>;
  }[] = [];
  // Do in two steps to avoid adding routes that don't have a view implemented
  for (const routeId of routeIds) {
    const render = getRouteIdComponent(routeId);
    if (render) routes.push({ id: routeId, render });
  }

  const routesWithHomeFinish = [
    { id: "", render: (props: RouteProps) => <WelcomeHome {...props} /> },
    ...routes,
    { id: "", render: (props: RouteProps) => <Finished {...props} /> }
  ];

  useEffect(() => {
    if (externalRouteIds.length > 0 && status !== "active") {
      setStatus("active");
      setRouteN(0);
      setRouteIds(externalRouteIds);
    }
  }, [externalRouteIds, status]);

  function onBack() {
    setRouteN(n => (n <= 1 ? 0 : n - 1));
  }

  function onNext(id: string) {
    if (routeN === routesWithHomeFinish.length - 1) {
      // When clicking next on the last view, mark as finished
      setStatus("finished");
    } else {
      // Move to next route
      setRouteN(n => n + 1);
    }

    // ##### Simulate API call marking a view as done
    setExternalRouteIds(ids => ids.filter(routeId => routeId !== id));
  }

  return (
    <WelcomeModalContainer show={routes.length > 0 && status === "active"}>
      {routesWithHomeFinish[routeN] &&
        typeof routesWithHomeFinish[routeN].render === "function" &&
        routesWithHomeFinish[routeN].render({
          onBack,
          onNext: () => onNext(routesWithHomeFinish[routeN].id)
        })}
    </WelcomeModalContainer>
  );
}

/**
 * Welcome modal overlay container
 * Does a simple fade in/out animation. This component can appear abruptly
 * so the animation is important to soften it's flashy behaviour
 */
export const WelcomeModalContainer: React.FunctionComponent<{
  show: boolean;
}> = ({ show, children }) => {
  const [status, setStatus] = useState<FadeStatus>("null");

  useEffect(() => {
    let timeout: number;
    if (show) {
      if (status === "null") setStatus("opacity-0");
      if (status === "opacity-0")
        timeout = setTimeout(() => setStatus("opacity-1"), transitionMs / 2);
    } else {
      if (status === "opacity-1") setStatus("opacity-0");
      if (status === "opacity-0")
        timeout = setTimeout(() => setStatus("null"), transitionMs);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [show, status]);

  if (!children || status === "null") return null;
  return (
    <div className={joinCssClass("welcome-container", status)}>
      <div className="welcome">{children}</div>
    </div>
  );
};
