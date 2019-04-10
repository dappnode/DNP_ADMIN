import React from "react";
import { Route } from "react-router-dom";
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
// Pages
import pages from "./pages";
// Redux
import { getConnectionStatus } from "services/connectionStatus/selectors";
import { ToastContainer } from "react-toastify";

if (typeof pages !== "object") throw Error("pages must be an object");

class App extends React.Component {
  // App is the parent container of any other component.
  // If this re-renders, the whole app will. So DON'T RERENDER APP!
  // Check ONCE what is the status of the VPN, then display the page for nonAdmin
  // Even make the non-admin a route and fore a redirect

  render() {
    const { isOpen, isNotAdmin, error } = this.props.connectionStatus || {};

    if (isOpen) {
      return (
        <div className="body">
          {/* SideNav expands on big screens, while content-wrapper moves left */}
          <SideBar />
          <TopBar />
          <main>
            <ErrorBoundary>
              <NotificationsMain />
            </ErrorBoundary>
            <ErrorBoundary>
              {Object.values(pages).map(({ RootComponent, rootPath }) => (
                <Route
                  key={rootPath}
                  path={rootPath}
                  exact={rootPath === "/"}
                  component={RootComponent}
                />
              ))}
            </ErrorBoundary>
          </main>
          <ToastContainer />
        </div>
      );
    } else if (isNotAdmin) {
      return <NonAdmin />;
    } else if (error) {
      return <NoConnection />;
    } else {
      return <Loading msg={`Openning connection...`} />;
    }
  }
}

const mapStateToProps = createStructuredSelector({
  connectionStatus: getConnectionStatus
});

export default connect(mapStateToProps)(App);
