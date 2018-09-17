import React from "react";

export default class PackageDetails extends React.Component {
  render() {
    const pkg = this.props.pkg || {};

    return (
      <div className="mb-4">
        <div className="section-subtitle">Stats</div>
        <div className="card mb-4">
          <div className="card-body">
            <div>
              <strong>Version: </strong>
              {pkg.version + " " + (pkg.origin || "")}
            </div>
            <div>
              <strong>Use link: </strong>
              {pkg.name ? (
                <a href={"http://my." + pkg.name}>{"my." + pkg.name}</a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
