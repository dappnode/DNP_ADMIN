import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  getIsFirstTimeRunning,
  getNewFeatureIds
} from "services/dappnodeStatus/selectors";
import * as api from "API/calls";
// Components
import WelcomeModalContainer from "./WelcomeModalContainer";
import HelloFirstTime from "./HelloFirstTime";
import HelloOnUpdate from "./HelloOnUpdate";
import Finished from "./Finished";
import Repository from "./features/Repository";
import AutoUpdates from "./features/AutoUpdates";
import ChangeHostPassword from "./features/ChangeHostPassword";
// Utils
import { isEqual } from "lodash";
import { UiNewFeatureId } from "types";
// styles
import "./welcome.scss";

/**
 * This internal Welcome status allows to freeze featureIds
 * featureIds must be frozen during a welcome wizard flow so the user
 * can go back and next without the views changing or disapearing
 */
type Status = "active" | "finished";

interface RouteProps {
  onBack: () => void;
  onNext: () => void;
}

/**
 * Return a view for each routeId
 * RouteIds will be returned by the DAPPMANAGER is a correct order
 */
function getRouteIdComponent(
  routeId: UiNewFeatureId
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
function Welcome({
  featureIds,
  isFirstTimeRunning
}: {
  featureIds?: UiNewFeatureId[];
  isFirstTimeRunning?: boolean;
}) {
  const [routeN, setRouteN] = useState(0);
  const [status, setStatus] = useState<Status>("finished");
  // featureIds must be frozen during a welcome wizard flow
  // so the user can go back and next without the views changing
  const [intFeatureIds, setIntFeatureIds] = useState<UiNewFeatureId[]>([]);

  // Do in two steps to avoid adding routes that don't have a view implemented
  const routes: {
    featureId: UiNewFeatureId;
    render: React.FunctionComponent<RouteProps>;
  }[] = [];
  for (const featureId of intFeatureIds) {
    const render = getRouteIdComponent(featureId);
    if (render) routes.push({ featureId, render });
  }

  // Append first and last view to make the UX less abrupt
  const routesWithHomeFinish = [
    isFirstTimeRunning
      ? { render: (props: RouteProps) => <HelloFirstTime {...props} /> }
      : { render: (props: RouteProps) => <HelloOnUpdate {...props} /> },
    ...routes,
    { render: (props: RouteProps) => <Finished {...props} /> }
  ];

  // Only modify internal routes when the user is not completing the flow
  // When modifying internal routes, reset route counter and status
  // Make sure the routes have actually changed before restarting the flow
  useEffect(() => {
    if (
      featureIds &&
      featureIds.length > 0 &&
      status !== "active" &&
      !isEqual(intFeatureIds, featureIds)
    ) {
      setStatus("active");
      setRouteN(0);
      setIntFeatureIds(featureIds);
    }
  }, [featureIds, status]);

  function onBack() {
    setRouteN(n => (n <= 1 ? 0 : n - 1));
  }

  function onNext(id: UiNewFeatureId | false) {
    if (routeN === routesWithHomeFinish.length - 1) {
      // When clicking next on the last view, mark as finished
      setStatus("finished");
    } else {
      // Move to next route
      setRouteN(n => n + 1);
    }

    // Persist in the DAPPMANAGER that this new feature has been seen by the user
    if (id)
      api.uiNewFeatureStatusSet({ featureId: id, status: "seen" }).catch(e => {
        console.error(`Error on uiNewFeatureStatusSet(${featureId}, seen)`, e);
      });
  }

  const currentRoute = routesWithHomeFinish[routeN];
  const featureId = "featureId" in currentRoute && currentRoute.featureId;

  return (
    <WelcomeModalContainer show={routes.length > 0 && status === "active"}>
      {currentRoute &&
        typeof currentRoute.render === "function" &&
        currentRoute.render({ onBack, onNext: () => onNext(featureId) })}
    </WelcomeModalContainer>
  );
}

const mapStateToProps = createStructuredSelector({
  isFirstTimeRunning: getIsFirstTimeRunning,
  featureIds: getNewFeatureIds
});

export default connect(
  mapStateToProps,
  null
)(Welcome);
