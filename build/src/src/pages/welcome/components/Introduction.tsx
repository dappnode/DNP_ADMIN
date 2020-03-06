import React from "react";
import { Switch, Route, NavLink, RouteComponentProps } from "react-router-dom";
import newTabProps from "utils/newTabProps";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// Items
import { sidenavItems } from "components/navbar/navbarItems";
// styles
import "./welcome.scss";
import { joinCssClass } from "utils/css";

if (!Array.isArray(sidenavItems)) throw Error("sidenavItems must be an array");

const steps = 4;
const current = 2;

interface WelcomeProps {}

const Introduction: React.FunctionComponent<
  WelcomeProps & RouteComponentProps
> = ({ match }) => {
  const dotsState: boolean[] = [];
  for (let i = 0; i < steps; i++) {
    dotsState.push(i === current);
  }

  const routes: { subPath: string; render: any }[] = [
    {
      subPath: "1",
      render: () => (
        <div>
          <div className="top-image">
            <img src="https://assets-ouch.icons8.com/preview/772/f9ab877c-4089-459c-9814-88455b030420.png"></img>
          </div>
          <div className="middle-text">
            <div className="title">This is the setup</div>
            <p>You will setup various things to start</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="welcome">
        <div className="middle-text">
          <div className="title">This is the setup</div>
          <p>You will setup various things to start</p>
        </div>

        <Switch>
          {routes.map(route => (
            <Route
              key={route.subPath}
              path={`${match.path}/${route.subPath}`}
              render={route.render}
            />
          ))}

          <Route path="/" />
        </Switch>

        <div className="nav-buttons">
          <NavLink to={"#"}>
            <button type="button" className="btn btn-outline-dark">
              <MdChevronLeft />
            </button>
          </NavLink>

          <div className="dots">
            {dotsState.map((active, i) => (
              <div key={i} className={`dot ${joinCssClass({ active })}`}></div>
            ))}
          </div>

          <NavLink to={"#"}>
            <button type="button" className="btn btn-outline-dark">
              <MdChevronRight />
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Introduction;
