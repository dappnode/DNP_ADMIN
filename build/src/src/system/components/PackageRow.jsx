import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

function getLinksArray(manifest) {
  let homepage = manifest ? manifest.homepage || {} : {};
  if (typeof homepage === typeof "String") homepage = { homepage };
  else if (typeof homepage !== typeof {}) homepage = {};
  return Object.getOwnPropertyNames(homepage).map(e => ({
    name: e,
    link: homepage[e]
  }));
}

export default class PackageRow extends React.Component {
  render() {
    let id = this.props.pkg.name;
    let state = this.props.pkg.state;

    let dotClass = "text-danger";
    if (state === "running") dotClass = "text-success";

    let manifest = this.props.pkg.manifest || {};
    const links = getLinksArray(manifest).map((e, i) => (
      <a className="package-link" key={i} href={e.link}>
        {e.name}{" "}
      </a>
    ));

    return (
      <tr id={id}>
        <td>{"my." + this.props.pkg.name}</td>
        <td>{this.props.pkg.version}</td>
        <td>
          <span className={classNames("small", "state-light", dotClass)}>
            ⬤{" "}
          </span>
          <span className="state-label">{state}</span>
        </td>
        <td>{links}</td>
        <td>
          <div className="btn-group" role="group" aria-label="Basic example">
            <Link
              className="btn btn-outline-secondary tableAction-button"
              to={"system/" + this.props.pkg.name}
            >
              Settings
            </Link>
          </div>
        </td>
      </tr>
    );
  }
}
