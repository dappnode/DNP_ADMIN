import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

let imageArchie = {
  'nginx-proxy.dnp.dappnode.eth': 'https://image.ibb.co/gBe8R7/Nginx.png',
  'letsencrypt-nginx.dnp.dappnode.eth': 'https://image.ibb.co/f3yzzS/letsencrypt.png'
}
let defaultImg = 'https://pbs.twimg.com/profile_images/828669925996781569/4clLqawr.jpg'

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let name = this.props.pkg.name
    let status = this.props.pkg.status
    let id = name;
    let description = this.props.pkg.manifest.description || 'Awesome dnp'
    let type = this.props.pkg.manifest.type || 'library'

    let namePretty = capitalize( name.split('.dnp.dappnode.eth')[0] )
    let img = this.props.pkg.avatar || defaultImg
    let allowInstall = Boolean(this.props.pkg.disableInstall)
    // Transform tag
    let tagStyle = ''
    let tag = this.props.pkg.tag
    if (tag.toLowerCase() == 'install') tagStyle = 'active'
    if (tag.toLowerCase() == 'update') tagStyle = 'active'
    if (tag.toLowerCase() == 'installed') tagStyle = 'unactive'

    // ##### Text under the card's title showing the status
    // <p class="card-text">Status: {status}</p>

    return (
      <div class="col-lg-3 col-md-4 col-sm-6 portfolio-item mb-4 box-shadow card-max-width">
        <div class="card h-100 shadow card-clickable"
          data-toggle="modal"
          data-target={this.props.modalTarget}
          onClick={this.props.preInstallPackage}
          id={id}
          disabled={allowInstall}
        >
          <div class="p-1 hover-animation" data-text={description}>
            <img class="card-img-top " src={img} alt="Card image cap"/>
          </div>
          <div class="card-body text-nowrap">
            <h5 class="card-title">{namePretty}</h5>
            <div class="d-flex justify-content-between">
              <span class="card-type">{type}</span>
              <span class={"card-tag "+tagStyle}>{tag}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class PackageStore extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cards = [];
    const directory = this.props.directory || []
    for (let i = 0; i < directory.length; i++) {
      let pkg = directory[i];
      cards.push(
        <Card
          key={i}
          pkg={pkg}
          preInstallPackage={this.props.preInstallPackage}
          modalTarget={this.props.modalTarget}
        />
      );
    }

    if(!this.props.isSyncing && this.props.directory.length == 0) {
      return (
        <div>
          <div class="d-flex justify-content-center mt-3">
            <p>Loading package directory...</p>
          </div>
          <div class="d-flex justify-content-center mt-3">
            <div class="loader"></div>
          </div>
        </div>
      )

    } else {
      return (
        <div class="row">
          {cards}
        </div>
      );
    }

  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
