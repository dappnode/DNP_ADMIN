import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';
import semver from 'semver'
import waitImg from 'Img/wait-min.png'


function getTag(v_now, v_avail) {
  // If there is no current version, display install
  if (!v_now) return 'Install'
  // Prevent the function from crashing
  if (!semver.valid(v_now)) return 'Install (unk v_now='+v_now+')'
  if (!semver.valid(v_avail)) return 'Install (unk v_avail='+v_avail+')'
  // Compare versions and return appropiate tag
  if (semver.lt(v_now, v_avail)) return 'Update'
  else return 'Installed'
}


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

    const pkg = this.props.pkg
    // The pkg can be incomplete, prevent crashes

    const name = pkg.name || '?'
    const status = pkg.status || '?'
    const id = name;
    const description = pkg.manifest ? pkg.manifest.description || 'Awesome dnp' : '?'
    const type = pkg.manifest ? pkg.manifest.type || 'library' : '?'

    const namePretty = capitalize( name.split('.dnp.dappnode.eth')[0] )
    const imgClass = pkg.avatar ? '' : 'wait'
    const img = pkg.avatar || waitImg

    const allowInstall = Boolean(pkg.disableInstall) // ######

    let tag = pkg.manifest ? getTag(pkg.currentVersion, pkg.manifest.version) : 'loading'

    let tagStyle = ''
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
            <img class={"card-img-top "+imgClass} src={img} alt="Card image cap"/>
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
    const directory = this.props.directory || {}
    const cards = Object.getOwnPropertyNames(directory).map((pkgName, i) =>(
      <Card
        key={i}
        pkg={this.props.directory[pkgName]}
        preInstallPackage={this.props.preInstallPackage}
        modalTarget={this.props.modalTarget}
      />
    ))

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
