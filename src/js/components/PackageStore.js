import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    let versions = this.props.package.versions

    let options = versions.map((version, i) => {
      return <option key={i}>{version}</option>
    })
    let name = this.props.package.name
    let namePretty = capitalize( name.split('.dnp.dappnode.eth')[0] )
    let img = imageArchie[name] || defaultImg

    let id = this.props.package.name;
    return (
      <div class="col-lg-3 col-md-4 col-sm-6 portfolio-item">
        <div class="card h-100">
          <img class="card-img-top" src={img} alt="Card image cap" />
          <div class="card-body">
            <div class="input-group mb-3">
              <select class="form-control custom-select"
                id={id+'@version'}
                >
                  {options}
              </select>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button"
                  id={id}
                  onClick={this.props.installPackage}
                >Install
                </button>
              </div>
            </div>
            <h5 class="card-title">{namePretty}</h5>
            <p class="card-text">Status: {this.props.package.status}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default class PackageDirectory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cards = [];
    for (let i = 0; i < this.props.directory.length; i++) {
      let _package = this.props.directory[i];
      cards.push(
        <Card
          package={_package}
          key={i}
          installPackage={this.props.installPackage}
        />
      );
    }

    return (
      <div class="row">
        {cards}
      </div>
    );
  }
}
