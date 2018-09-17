import React from "react";

export default class PackageDetails extends React.Component {
  render() {
    // function getLinksArray(manifest) {
    //   let homepage = manifest ? manifest.homepage || {} : {};
    //   if (typeof homepage === typeof "String") homepage = { homepage };
    //   else if (typeof homepage !== typeof {}) homepage = {};
    //   return Object.getOwnPropertyNames(homepage).map(e => ({
    //     name: e,
    //     link: homepage[e]
    //   }));
    // }

    // let manifest = pkg.manifest || {};
    // const links = getLinksArray(manifest).map((e, i) => (
    //   <a className="package-link" key={i} href={e.link}>
    //     {e.name}{" "}
    //   </a>
    // ));

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
