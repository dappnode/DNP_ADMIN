import React from "react";
import ClipboardJS from "clipboard";
import PropTypes from "prop-types";
import waitImg from "img/wait-min.png";
import errorImg from "img/error-min.png";
import enhancePkg from "utils/enhancePkg";

new ClipboardJS(".btn");

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

    // ##### Text under the card's title showing the status
    // <p className="card-text">Status: {status}</p>

    return (
      <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 portfolio-item mb-4 box-shadow card-max-width">
        <div
          className="card h-100 shadow card-clickable"
          data-toggle="modal"
          data-target={this.props.modalTarget}
          onClick={this.onCardClick.bind(this)}
          id={pkg.id}
        >
          <div className="p-1 hover-animation" data-text={pkg.description}>
            <img
              className={"card-img-top " + imgClass}
              src={img}
              alt="Card cap"
            />
          </div>
          <div className="card-body text-nowrap">
            <h5 className="card-title">{pkg.namePretty}</h5>
            <div className="d-flex justify-content-between">
              <span className="card-type">{pkg.type}</span>
              <span className={"card-tag " + pkg.tagStyle}>{pkg.tag}</span>
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
