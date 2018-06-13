import React from "react";
import ClipboardJS from "clipboard";
import semver from "semver";
import waitImg from "img/wait-min.png";
import errorImg from "img/error-min.png";

function getTag(v_now, v_avail) {
  // If there is no current version, display install
  if (!v_now) return "Install";
  // Prevent the function from crashing
  if (!semver.valid(v_now)) return "Install (unk v_now=" + v_now + ")";
  if (!semver.valid(v_avail)) return "Install (unk v_avail=" + v_avail + ")";
  // Compare versions and return appropiate tag
  if (semver.lt(v_now, v_avail)) return "Update";
  else return "Installed";
}

new ClipboardJS(".btn");

class Card extends React.Component {
  render() {
    const pkg = this.props.pkg;
    // The pkg can be incomplete, prevent crashes

    let name = pkg.name || "?";
    // let status = pkg.status || '?' // Not needed at the moment
    let id = name;
    let description = pkg.manifest
      ? pkg.manifest.description || "Awesome dnp"
      : "?";
    let type = pkg.manifest ? pkg.manifest.type || "library" : "?";

    let namePretty = capitalize(name.split(".dnp.dappnode.eth")[0]);
    let imgClass = pkg.avatar ? "" : "wait";
    let img = pkg.avatar || waitImg;

    const allowInstall = Boolean(pkg.disableInstall); // ######

    let tag = pkg.manifest
      ? getTag(pkg.currentVersion, pkg.manifest.version)
      : "loading";

    let tagStyle = "";
    if (tag.toLowerCase() === "install") tagStyle = "active";
    if (tag.toLowerCase() === "update") tagStyle = "active";
    if (tag.toLowerCase() === "installed") tagStyle = "unactive";

    // If package broke, re-assign variables
    if (pkg.error) {
      type = "";
      description = pkg.error;
      img = errorImg;
      imgClass = "";
      tag = "ERROR";
      tagStyle = "unactive";
    }

    // ##### Text under the card's title showing the status
    // <p className="card-text">Status: {status}</p>

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 portfolio-item mb-4 box-shadow card-max-width">
        <div
          className="card h-100 shadow card-clickable"
          data-toggle="modal"
          data-target={this.props.modalTarget}
          onClick={this.props.preInstallPackage}
          id={id}
          disabled={allowInstall}
        >
          <div className="p-1 hover-animation" data-text={description}>
            <img
              className={"card-img-top " + imgClass}
              src={img}
              alt="Card cap"
            />
          </div>
          <div className="card-body text-nowrap">
            <h5 className="card-title">{namePretty}</h5>
            <div className="d-flex justify-content-between">
              <span className="card-type">{type}</span>
              <span className={"card-tag " + tagStyle}>{tag}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class PackageStore extends React.Component {
  render() {
    const directory = this.props.directory || {};
    const cards = Object.getOwnPropertyNames(directory).map((pkgName, i) => (
      <Card
        key={i}
        pkg={this.props.directory[pkgName]}
        preInstallPackage={this.props.preInstallPackage}
        modalTarget={this.props.modalTarget}
      />
    ));

    if (!this.props.isSyncing && this.props.directory.length === 0) {
      return (
        <div>
          <div className="d-flex justify-content-center mt-3">
            <p>Loading package directory...</p>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <div className="loader" />
          </div>
        </div>
      );
    } else {
      return <div className="row">{cards}</div>;
    }
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
