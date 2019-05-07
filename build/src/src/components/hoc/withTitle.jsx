import React from "react";
import { getDisplayName } from "./utilities";

export default function withTitleFactory(_title) {
  return function withTitle(WrappedComponent) {
    class WithTitle extends React.Component {
      render() {
        const title = this.props.title || _title;
        const subtitle = this.props.subtitle;
        return (
          <>
            {subtitle ? (
              <div className="section-title">
                <span className="pre-title">{title} </span>
                {subtitle}
              </div>
            ) : (
              <div className="section-title">{title}</div>
            )}
            <WrappedComponent {...this.props} />
          </>
        );
      }
    }
    WithTitle.displayName = `WithTitle(${getDisplayName(WrappedComponent)})`;
    return WithTitle;
  };
}
