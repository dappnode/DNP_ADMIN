import React, { Component } from "react";
// import { Route, NavLink as Link } from "react-router-dom";
import saveAs from "file-saver";
// General components
import HiddenRedirector from "./HiddenRedirector";
// Platform dedicated components
// import Instructions from "./Instructions/Instructions";
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
import getServerName from "./utils/getServerName";
import isClientOnSameNetwork from "./utils/isClientOnSameNetwork";
// Logos
import errorLogo from "./img/error.png";
import okLogo from "./img/ok.png";
import logo from "./img/logo.png";
// Icons
import FaAndroid from "./icons/FaAndroid";
import FaApple from "./icons/FaApple";
import FaChrome from "./icons/FaChrome";
import FaLinux from "./icons/FaLinux";
import FaMobile from "./icons/FaMobile";
import FaWindows from "./icons/FaWindows";

window.saveAs = saveAs;

const instructionsBaseUrl =
  "https://github.com/dappnode/dappnode/wiki/openvpn-client-guide";

const options = [
  {
    name: "MacOS",
    route: "macos",
    component: MacOS,
    icon: FaApple,
    link: `${instructionsBaseUrl}#macos`
  },
  {
    name: "iOS",
    route: "ios",
    component: iOS,
    icon: FaMobile,
    link: `${instructionsBaseUrl}#ios`
  },
  {
    name: "Windows",
    route: "windows",
    component: Windows,
    icon: FaWindows,
    link: `${instructionsBaseUrl}#windows`
  },
  {
    name: "Android",
    route: "android",
    component: Android,
    icon: FaAndroid,
    link: `${instructionsBaseUrl}#android`
  },
  {
    name: "Linux",
    route: "linux",
    component: Linux,
    icon: FaLinux,
    link: `${instructionsBaseUrl}#linux`
  },
  {
    name: "Chromebook",
    route: "chromebook",
    component: Chromebook,
    icon: FaChrome,
    link: `${instructionsBaseUrl}#android`
  }
];

const natLoopbackDisabledUrl =
  "https://dappnode.github.io/DAppNodeDocs/troubleshooting/#nat-loopback-disabled";

const { origin, hostname } = window.location;
const ovpnType = "application/x-openvpn-profile";
const fileExtension = "ovpn";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      file: null,
      fileSameNetwork: null
    };
  }

  async componentDidMount() {
    try {
      // 1. Get params from url
      this.setState({ loading: true });
      const { key, id, name, dev, intip, ip } = getParamsFromUrl();
      const url = `${origin}/cred/${id}?id=${id}`;

      // Dev param to be able to work on the UI
      if (dev) {
        if (dev === "error") this.setState({ loading: false, error: "error" });
        if (dev === "loading") this.setState({ loading: true });
        if (dev === "success") this.setState({ loading: false, file: "file" });
        if (dev === "success-intip")
          this.setState({
            loading: false,
            file: "file",
            fileSameNetwork: "file-same-network"
          });
        return console.warn(`dev parameter set, dev: ${dev}`);
      }

      // 2. Fetch file from server
      const res = await fetch(url);
      if (res.status === 404)
        throw Error("Link expired, contact your DAppNode administrator");
      if (!res.ok)
        throw Error(`Error fetching your credentials file: ${res.statusText}`);
      const encryptedFile = await res.text();

      // 3. Decrypt
      if (!isBase64(encryptedFile))
        throw Error(
          `Incorrect ID or wrong file format (no-base64). url: ${url} encryptedFile: ${(
            encryptedFile || ""
          ).substring(0, 100)}...\n`
        );
      const file = decrypt(encryptedFile, key);

      // 4. If noNatLoopback = true, check if the user is at the same network as the DAppNode
      if (intip && (await isClientOnSameNetwork({ id, ip })))
        if (file.includes(hostname))
          // Substitute the profile's domain or IP with the internal IP
          this.setState({ fileSameNetwork: file.replace(hostname, intip) });
        else
          console.error(`Credentials do not contain the hostname ${hostname}`);

      // 5. Store the resulting file in the App's state
      this.setState({ loading: false, file, name });
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message || "Unknown error"
      });
      console.error("Error resolving request", err);
    }
  }

  download({ sameNetwork }) {
    const { file, fileSameNetwork, name } = this.state;
    // customize file for the same network case
    const serverName =
      getServerName(name) + (sameNetwork ? "_same_network" : "");
    const fileToBlob = sameNetwork ? fileSameNetwork : file;
    // saveAs standard code
    const blob = new Blob([fileToBlob], { type: ovpnType });
    const filename = `${serverName}.${fileExtension}`;
    saveAs(blob, filename);
  }

  downloadSameNetwork() {
    this.download({ sameNetwork: true });
  }

  render() {
    const { file, fileSameNetwork, error, loading } = this.state;

    if (error) {
      return (
        <div className="container text-center mt-5">
          <img src={errorLogo} className="main-logo" alt="logo" />
          <h6 className="main-text">{error}</h6>
        </div>
      );
    }

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
                />
                Successfully decrypted .ovpn file
              </h6>

              {fileSameNetwork ? (
                <div>
                  <div
                    className="alert alert-warning"
                    style={{ marginTop: "1rem" }}
                  >
                    Warning! You may need different VPN profiles because Nat
                    Loopback is disabled. Please, use the profile below to
                    connect to your DAppNode when you are in its same network.{" "}
                    <a href={natLoopbackDisabledUrl}>Read more</a>.
                  </div>
                  <button
                    className="btn btn-primary dappnode-background-color"
                    onClick={this.download.bind(this)}
                    style={{ marginRight: "1rem", marginBottom: "1rem" }}
                  >
                    Download
                  </button>
                  <button
                    className="btn btn-primary dappnode-background-color"
                    onClick={this.downloadSameNetwork.bind(this)}
                    style={{ marginBottom: "1rem" }}
                  >
                    Download - on same network
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary dappnode-background-color"
                  onClick={this.download.bind(this)}
                >
                  Download
                </button>
              )}
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
            <div className="row instructions-row">
              {options.map((option, i) => (
                <div key={i} className="col-6 col-sm-6 col-md-4 col-lg-2 mt-4">
                  <a
                    className="instructions-link text-center nav-link"
                    href={option.link}
                  >
                    <div className="nav-icon">
                      <option.icon />
                    </div>
                    <div className="nav-text">{option.name}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <HiddenRedirector />
        </React.Fragment>
      );
    }

    if (loading) {
      return (
        <div className="container text-center mt-5">
          <img src={logo} className="main-logo" alt="logo" />
          <h6 className="main-text">Loading...</h6>
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
