import React, { Component } from "react";
import { Route, NavLink as Link } from "react-router-dom";
import saveAs from 'file-saver';
// General components
import HiddenRedirector from "./HiddenRedirector";
// Platform dedicated components
import Instructions from "./Instructions/Instructions";
import MacOS from "./Instructions/MacOS";
import Windows from "./Instructions/Windows";
import Android from "./Instructions/Android";
import iOS from "./Instructions/iOS";
import Linux from "./Instructions/Linux";
import Chromebook from "./Instructions/Chromebook";
// Utils
import getParamsFromUrl from "./utils/getParamsFromUrl";
import isBase64 from "./utils/isBase64";
import decrypt from "./utils/decrypt";
// Logos
import loadingLogo from "./img/loading.gif";
import errorLogo from "./img/error.png";
import okLogo from "./img/ok.png";
import logo from "./img/logo.png";
// Icons
import FaAndroid from './icons/FaAndroid'
import FaApple from './icons/FaApple'
import FaChrome from './icons/FaChrome'
import FaLinux from './icons/FaLinux'
import FaMobile from './icons/FaMobile'
import FaWindows from './icons/FaWindows'

window.saveAs = saveAs

// Recommended clients
// MacOS -> Tunnelblick https://tunnelblick.net/
// iOS -> OpenVPN Connect https://itunes.apple.com/us/app/openvpn-connect/id590379981?mt=8
// Windows -> OpenVPN (community installer) https://openvpn.net/community-downloads/
// Android -> OpenVPN for Android (?) https://play.google.com/store/apps/details?id=de.blinkt.openvpn&hl=en

const options = [
  {
    name: "MacOS",
    route: "macos",
    component: MacOS,
    icon: FaApple,
    client: {
      name: "Tunnelblick",
      banner:
        "https://tunnelblick.net/images/using-tunnelblick-dmg-2010-10-16.png",
      url: "https://tunnelblick.net/"
    }
  },
  {
    name: "iOS",
    route: "ios",
    component: iOS,
    icon: FaMobile,
    client: {
      name: "OpenVPN Connect",
      banner:
        "https://help.endian.com/hc/article_attachments/360011891853/IMG_6552.jpg",
      url: "https://itunes.apple.com/us/app/openvpn-connect/id590379981"
    }
  },
  {
    name: "Windows",
    route: "windows",
    component: Windows,
    icon: FaWindows,
    client: {
      name: "OpenVPN (community installer)",
      banner: "https://openvpn.net/wp-content/uploads/openvpn.jpg",
      url: "https://openvpn.net/community-downloads/"
    }
  },
  {
    name: "Android",
    route: "android",
    component: Android,
    icon: FaAndroid,
    client: {
      name: "OpenVPN for Android",
      banner: "http://www.earthvpn.com/images/2013-08-26-13-46-27.png",
      url: "https://play.google.com/store/apps/details?id=de.blinkt.openvpn"
    }
  },
  {
    name: "Linux",
    route: "linux",
    component: Linux,
    icon: FaLinux,
    client: {
      name: "?",
      banner: "",
      url: "?"
    }
  },
  {
    name: "Chromebook",
    route: "chromebook",
    component: Chromebook,
    icon: FaChrome,
    client: {
      name: "OpenVPN for Android",
      banner: "",
      url: "https://play.google.com/store/apps/details?id=de.blinkt.openvpn"
    }
  }
];

const baseUrl = window.location.origin;
const ovpnType = "application/x-openvpn-profile";
const filename = "sample.ovpn"

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      file: null
    };
  }

  async componentDidMount() {
    try {
      // 1. Get params from url
      this.setState({ loading: true });
      const { key, id } = getParamsFromUrl();
      const url = `${baseUrl}/cred/${id}?id=${id}`;

      // 2. Fetch file from server
      const res = await fetch(url);
      if (!res.ok) throw Error(res.statusText);
      const encryptedFile = await res.text();

      // 3. Decrypt
      if (!isBase64(encryptedFile))
        throw Error(`Incorrect ID or wrong file format (no-base64). url: ${url} encryptedFile: ${(encryptedFile || '').substring(0, 50)}...\n`);
      const file = decrypt(encryptedFile, key);
      this.setState({ loading: false, file });
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message || "Unknown error"
      });
      console.error("Error resolving request", err);
    }
  }

  render() {
    const { file, error, loading } = this.state;
    const blob = new Blob([file], {type: ovpnType});

    // <item.icon />

    if (file) {
      return (
        <React.Fragment>
          <div className="container">
            <h2 className="mt-5">Set up your DAppNode OpenVPN connection</h2>
            <p className="jumotron-subtitle">
              Download the .ovpn file provided by your DAppNode administrator
              and import it to your client. You can follow the guides below on
              how to import an .opvn file.
            </p>
            <div className="text-center">
              <h6 className="main-text mt-4">
                <img
                  src={okLogo}
                  className="main-logo"
                  alt="ok"
                  style={{ height: "18px", margin: "0px 7px 0px 0px" }}
                />Successfully decrypted .ovpn file
              </h6>
              <button
                className="btn btn-primary dappnode-background-color"
                onClick={saveAs.bind(this, blob, filename)}
              >
                Download
              </button>
            </div>
          </div>
          <div className="jumbotron-area">
            <div className="container text-center">
              <h2 className="jumbotron-title">
                Haven't installed an OpenVPN client already?
              </h2>
              <p className="jumotron-subtitle">Choose your OS below</p>
            </div>
          </div>
          <div className="container">
            <ul className="nav nav-tabs">
              {options.map((option, i) => (
                <li key={i} className="nav-item">
                  <Link
                    className="nav-link"
                    activeClassName="active"
                    activeStyle={{ backgroundColor: "#f3f5f6" }}
                    to={{ pathname: option.route, hash: window.location.hash }}
                    query={this.props.query}
                  >
                    <span className="nav-icon">
                      <option.icon />
                    </span>
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              {options.map(option => (
                <Route
                  key={option.route}
                  path={"/" + option.route}
                  render={props => <Instructions {...props} {...option} />}
                />
              ))}
              <hr className="my-4" />
            </div>
          </div>
          <HiddenRedirector />
        </React.Fragment>
      );
    }

    if (error) {
      return (
        <div className="container text-center mt-5">
          <img src={errorLogo} className="main-logo" alt="logo" />
          <h6 className="main-text">{error}</h6>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="container text-center mt-5">
          <img src={loadingLogo} className="main-logo" alt="logo" />
          <h6 className="main-text">Loading</h6>
        </div>
      );
    }

    return (
      <div className="container text-center mt-5">
        <img src={logo} className="main-logo" alt="logo" />
        <h6 className="main-text">¯\_(ツ)_/¯</h6>
      </div>
    );
  }
}
