import React from "react";
import ClipboardJS from "clipboard";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// Imgs
import Loading from "components/generic/Loading";
import errorAvatar from "img/errorAvatar.png";
import ipfsBadgeImg from "img/IPFS-badge-small.png";
import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import NoPackageFound from "./NoPackageFound";
import IsSyncing from "./IsSyncing";
import enhancePkg from "utils/enhancePkg";
// Metadata
import { rootPath as installerRootPath } from "../data";
import { rootPath as packagesRootPath } from "pages/packages/data";

new ClipboardJS(".btn");

class Card extends React.Component {
  render() {
    const pkg = enhancePkg(this.props.pkg);

    let img = pkg.error ? errorAvatar : pkg.avatar || defaultAvatar;

    const manifest = pkg.manifest || {};
    const kwArray = manifest.keywords || [];
    const keywords = kwArray.length ? kwArray.join(", ") : "DAppNode package";
    const fromIpfs = (pkg || {}).origin;
    const ipfsBadge = fromIpfs ? (
      <div>
        <img
          src={ipfsBadgeImg}
          style={{ width: "59px", marginRight: "5px" }}
          alt="ipfs"
        />
        <span style={{ position: "relative", top: "1px" }}>
          {fromIpfs.replace("/ipfs/", "")}
        </span>
      </div>
    ) : null;

    const url =
      pkg.tag === "UPDATED"
        ? packagesRootPath + "/" + manifest.name
        : installerRootPath + "/" + (pkg.url || pkg.id);

    // Disable button:
    let disable = false;
    if (pkg.tag.toLowerCase() === "updated") {
      disable = true;
    }

    // ##### Text under the card's title showing the status
    // <p className="card-text">Status: {status}</p>

    return (
      <div className="portfolio-item box-shadow">
        <div className="card h-100 shadow card-clickable" id={pkg.id}>
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            to={url}
          >
            <div className="card-body text-nowrap" style={{ padding: "15px" }}>
              <div className="row">
                <div className="col-4" style={{ paddingRight: 0 }}>
                  <img className="card-img-top" src={img} alt="Card cap" />
                </div>
                <div className="col-8">
                  <h5
                    className="card-title dot-overflow"
                    style={{ marginBottom: "4px" }}
                  >
                    {pkg.namePretty}
                  </h5>
                  <div className="capitalize dot-overflow">
                    {pkg.description}
                  </div>
                  <div className="capitalize dot-overflow lightGray">
                    {fromIpfs ? ipfsBadge : keywords}
                  </div>
                  <button
                    className="btn pill btn-dappnode"
                    type="submit"
                    style={{ textTransform: "uppercase", marginTop: "12px" }}
                    disabled={disable}
                  >
                    {/* Rename tag from "install" to "get" because there were too many "install" tags 
                        Cannot change the actual tag because it is used for logic around the installer */}
                    {pkg.tag === "INSTALL" ? "GET" : pkg.tag}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default class PackageStore extends React.Component {
  static propTypes = {
    directory: PropTypes.array.isRequired,
    directoryLoaded: PropTypes.bool.isRequired,
    openPackage: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired
  };

  render() {
    const cards = this.props.directory.map((pkg, i) => (
      <Card key={i} pkg={pkg} openPackage={this.props.openPackage} />
    ));

    if (this.props.fetching && this.props.directory.length === 0) {
      return <Loading msg="Loading package directory..." />;
    } else if (this.props.isSyncing) {
      return <IsSyncing />;
    } else if (
      this.props.directoryLoaded &&
      this.props.directory.length === 0
    ) {
      return <NoPackageFound />;
    } else {
      return <div className="dnp-cards">{cards}</div>;
    }
  }
}
