import React, { Component } from "react";
import { Route, NavLink as Link } from "react-router-dom";
// General components
import HiddenRedirector from "./HiddenRedirector";
// Platform dedicated components
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
import {
  FaWindows,
  FaApple,
  FaMobile,
  FaAndroid,
  FaLinux,
  FaChrome
} from "react-icons/lib/fa";

const options = [
  {
    name: "MacOS",
    route: "macos",
    component: MacOS,
    icon: FaApple
  },
  {
    name: "iOS",
    route: "ios",
    component: iOS,
    icon: FaMobile
  },
  {
    name: "Windows",
    route: "windows",
    component: Windows,
    icon: FaWindows
  },
  {
    name: "Android",
    route: "android",
    component: Android,
    icon: FaAndroid
  },
  {
    name: "Linux",
    route: "linux",
    component: Linux,
    icon: FaLinux
  },
  {
    name: "Chromebook",
    route: "chromebook",
    component: Chromebook,
    icon: FaChrome
  }
];

// Recommended clients
// MacOS -> Tunnelblick https://tunnelblick.net/
// iOS -> OpenVPN Connect https://itunes.apple.com/us/app/openvpn-connect/id590379981?mt=8
// Windows -> OpenVPN (community installer) https://openvpn.net/community-downloads/
// Android -> OpenVPN for Android (?) https://play.google.com/store/apps/details?id=de.blinkt.openvpn&hl=en

const baseUrl = window.location.origin;
const type = "application/x-openvpn-profile";

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
      const url = `${baseUrl}/cred/${id}`;

      // 2. Fetch file from server
      const res = await fetch(url);
      if (!res.ok) throw Error(res.statusText);
      const encryptedFile = await res.text();

      // 3. Decrypt
      if (!isBase64(encryptedFile))
        throw Error(`Incorrect ID or wrong file format`);
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
    console.log({ file, error, loading });

    // <item.icon />

    if (file) {
      return (
        <React.Fragment>
          <div className="container">
            <div className="text-center">
              <img src={okLogo} className="main-logo" alt="ok" />
              <h6 className="main-text">Successfully decoded file</h6>
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-primary dappnode-background-color"
                href={window.URL.createObjectURL(new Blob([file], { type }))}
                download="sample.ovpn"
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
                  component={option.component}
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
        <div className="container text-center">
          <img src={errorLogo} className="main-logo" alt="logo" />
          <h6 className="main-text">{error}</h6>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="container text-center">
          <img src={loadingLogo} className="main-logo" alt="logo" />
          <h6 className="main-text">Loading</h6>
        </div>
      );
    }

    return (
      <div className="container text-center">
        <img src={logo} className="main-logo" alt="logo" />
        <h6 className="main-text">¯\_(ツ)_/¯</h6>
      </div>
    );
  }
}
