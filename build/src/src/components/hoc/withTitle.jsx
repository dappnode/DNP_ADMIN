import React from "react";
import { getDisplayName } from "./utilities";

export default function withTitle(WrappedComponent) {
  class WithTitle extends React.Component {
    render() {
      const { title, subtitle } = this.props;
      return (
        <React.Fragment>
          {subtitle ? (
            <div className="section-title">
              <span className="pre-title">{title} </span>
              {subtitle}
            </div>
          ) : (
            <div className="section-title">{title}</div>
          )}
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  }
  WithTitle.displayName = `WithTitle(${getDisplayName(WrappedComponent)})`;
  return WithTitle;
}
