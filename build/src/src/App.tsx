import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// Components
import NotificationsMain from "./components/NotificationsMain";
import NonAdmin from "./components/NonAdmin";
import NoConnection from "components/NoConnection";
import ErrorBoundary from "./components/generic/ErrorBoundary";
import TopBar from "./components/navbar/TopBar";
import SideBar from "./components/navbar/SideBar";
import Loading from "components/generic/Loading";
import ScrollToTop from "components/ScrollToTop";
// Pages
import pages, { defaultPage } from "./pages";
// Redux
import { getConnectionStatus } from "services/connectionStatus/selectors";
import { ToastContainer } from "react-toastify";
import Welcome from "pages/welcome/components/Welcome";

if (typeof pages !== "object") throw Error("pages must be an object");

function App({
  connectionStatus
}: {
  connectionStatus?: { isOpen: boolean; isNotAdmin: boolean; error: string };
}) {
  // App is the parent container of any other component.
  // If this re-renders, the whole app will. So DON'T RERENDER APP!
  // Check ONCE what is the status of the VPN, then display the page for nonAdmin
  // Even make the non-admin a route and fore a redirect

  const { isOpen, isNotAdmin, error } = connectionStatus || {};

  if (isOpen) {
    return (
      <div className="body">
        <Switch>
          {/* Routes that require a full-screen */}
          <Route path="/welcome" component={Welcome} />

          <Route path="*">
            {/* SideNav expands on big screens, while content-wrapper moves left */}
            <SideBar />
            <TopBar />
            <div id="main">
              <ErrorBoundary>
                <NotificationsMain />
              </ErrorBoundary>

              <Switch>
                {Object.values(pages).map(({ RootComponent, rootPath }) => (
                  <Route
                    key={rootPath}
                    path={rootPath}
                    exact={rootPath === "/"}
                    render={props => (
                      <ErrorBoundary>
                        <RootComponent {...props} />
                      </ErrorBoundary>
                    )}
                  />
                ))}
                {/* 404 routes redirect to dashboard or default page */}
                <Route path="*">
                  <Redirect to={defaultPage.rootPath} />
                </Route>
              </Switch>
            </div>
          </Route>
        </Switch>

        {/* Place here non-page components */}
        <ToastContainer />
        <ScrollToTop />
      </div>
    );
  } else if (isNotAdmin) {
    return <NonAdmin />;
  } else if (error) {
    return <NoConnection />;
  } else {
    return <Loading msg={`Opening connection...`} />;
  }
}

const mapStateToProps = createStructuredSelector({
  connectionStatus: getConnectionStatus
});

export default connect(mapStateToProps)(App);
