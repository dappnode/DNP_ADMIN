import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { getDisplayName } from "./utilities";
import { getIsLoadingById } from "services/loadingStatus/selectors";
import Loading from "components/generic/Loading";

export default function withLoading(loadingId, loadingMsg) {
  return function(WrappedComponent) {
    class WithLoading extends React.Component {
      render() {
        if (this.props.isLoading) {
          return <Loading msg={`Loading ${loadingMsg || loadingId}...`} />;
        }
        return <WrappedComponent {...this.props} />;
      }
    }
    WithLoading.displayName = `WithLoading(${getDisplayName(
      WrappedComponent
    )})`;

    const mapStateToProps = createStructuredSelector({
      isLoading: getIsLoadingById(loadingId)
    });

    return connect(mapStateToProps)(WithLoading);
  };
}
