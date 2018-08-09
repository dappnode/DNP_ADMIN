import React from "react";
import ClipboardJS from "clipboard";
import PropTypes from "prop-types";
import waitImg from "img/wait-min.png";
import errorImg from "img/error-min.png";
import enhancePkg from "utils/enhancePkg";

new ClipboardJS(".btn");

function getKeywords(pkg) {
  const manifest = pkg.manifest || {};
  const keywords = manifest.keywords || [];
  return keywords.length ? keywords.join(", ") : "DAppNode package";
}

class Card extends React.Component {
  onCardClick(e) {
    this.props.preInstallPackage(e.currentTarget.id);
  }

  render() {
    const pkg = enhancePkg(this.props.pkg);

    // The pkg can be incomplete, prevent crashes

    let imgClass = pkg.avatar ? "" : "wait";
    let img = pkg.avatar || waitImg;

    // If package broke, re-assign variables
    if (pkg.error) {
      img = errorImg;
      imgClass = "";
    }

    const keywords = getKeywords(pkg);

    // Disable button:
    let disable = false;
    if (pkg.tag.toLowerCase() === "installed") {
      pkg.tag = "Updated";
      disable = true;
    }

    // ##### Text under the card's title showing the status
    // <p className="card-text">Status: {status}</p>

    return (
      <div className="col-xl-4 col-md-6 col-sm-12 col-xs-12 portfolio-item mb-4 box-shadow">
        <div
          className="card h-100 shadow card-clickable"
          data-toggle="modal"
          data-target={this.props.modalTarget}
          onClick={this.onCardClick.bind(this)}
          id={pkg.id}
        >
          <div className="card-body text-nowrap" style={{ padding: "15px" }}>
            <div className="row">
              <div className="col-4" style={{ paddingRight: 0 }}>
                <img
                  className={"card-img-top " + imgClass}
                  src={img}
                  alt="Card cap"
                />
              </div>
              <div className="col-8">
                <h5
                  className="card-title dot-overflow"
                  style={{ marginBottom: "4px" }}
                >
                  {pkg.namePretty}
                </h5>
                <div className="capitalize dot-overflow">{pkg.description}</div>
                <div className="capitalize dot-overflow lightGray">
                  {keywords}
                </div>
                <button
                  className="btn dappnode-pill"
                  type="submit"
                  data-dismiss="modal"
                  style={{ textTransform: "uppercase", marginTop: "12px" }}
                  disabled={disable}
                >
                  {pkg.tag}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class PackageStore extends React.Component {
  static propTypes = {
    directory: PropTypes.array.isRequired,
    preInstallPackage: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired
  };

  render() {
    const cards = this.props.directory.map((pkg, i) => (
      <Card
        key={i}
        pkg={pkg}
        preInstallPackage={this.props.preInstallPackage}
        modalTarget={this.props.modalTarget}
      />
    ));

    if (this.props.fetching && this.props.directory.length === 0) {
      return (
        <div>
          <div className="d-flex justify-content-center mt-3">
            <p>Loading package directory...</p>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <img
              className="wait"
              width="300"
              height="300"
              src={waitImg}
              alt="loading..."
            />
          </div>
        </div>
      );
    } else {
      return <div className="row">{cards}</div>;
    }
  }
}
