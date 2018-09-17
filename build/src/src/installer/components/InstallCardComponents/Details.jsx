import React from "react";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";

export default class Details extends React.Component {
  render() {
    const pkg = this.props.pkg;
    const manifest = pkg.manifest || {};
    const avatar = pkg.avatar || defaultAvatar;
    const size = manifest.image ? humanFileSize(manifest.image.size) || "" : "";
    return (
      <React.Fragment>
        <div className="section-subtitle">Details</div>
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-4" style={{ maxWidth: 200 }}>
                <img src={avatar} className="card-img-top" alt="Avatar" />
              </div>
              <div className="col-8">
                <p>{manifest.description}</p>
                <p>By {manifest.author}</p>
                <p>
                  Version {manifest.version} ({size})
                </p>
                {pkg.origin ? <p>Origin {pkg.origin}</p> : null}
              </div>
            </div>
            <div className="border-bottom" />
            <div className="mt-3">{this.props.subComponent}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
