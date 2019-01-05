import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { createStructuredSelector } from "reselect";
// Modules

const route = "/nonadmin";

class NonAdminRedirectorView extends React.Component {
  componentWillReceiveProps() {
    const isAdmin = this.props.isAdmin;
    if (isAdmin && "status" in isAdmin && isAdmin.status === -1) {
      this.props.redirect();
    }
  }
  render() {
    return null;
  }
}

const mapStateToProps = createStructuredSelector({
  pathname: state => state.router.location.pathname || "",
  isAdmin: state => state.status.isAdmin
});

const mapDispatchToProps = dispatch => {
  return {
    redirect: () => {
      dispatch(push(route));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NonAdminRedirectorView);
