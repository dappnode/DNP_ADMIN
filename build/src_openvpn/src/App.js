import React, { Component } from "react";
import decrypt from "./utils/decrypt";
import encryptWithRandomKey from "./utils/encryptWithRandomKey";
import isBase64 from "./utils/isBase64";
import getParamsFromUrl from "./utils/getParamsFromUrl";

// Graphics
import logo from "./img/logo.png";
import errorLogo from "./img/error-min.png";
import loadingLogo from "./img/dappNodeAnimation.gif";
import "./App.css";

const baseUrl = window.location.origin;
// const baseUrl = "http://localhost:8080";
const type = "application/x-openvpn-profile";

window.encryptWithRandomKey = encryptWithRandomKey;

const Ready = ({ file }) => (
  <React.Fragment>
    <img src={logo} className="logo" alt="logo" />
    <p>Successfully decoded file</p>
    <a
      href={window.URL.createObjectURL(new Blob([file], { type }))}
      download="sample.ovpn"
      className="dappnode-pill"
    >
      Download
    </a>
  </React.Fragment>
);

const Error = ({ error }) => (
  <React.Fragment>
    <img src={errorLogo} className="logo" alt="logo" />
    <p>{error}</p>
  </React.Fragment>
);

const Loading = () => (
  <React.Fragment>
    <img src={loadingLogo} className="logo" alt="logo" />
    <p>Loading</p>
  </React.Fragment>
);

const Fallback = () => (
  <React.Fragment>
    <img src={logo} className="logo" alt="logo" />
    <p>¯\_(ツ)_/¯</p>
  </React.Fragment>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: null,
      file: null
    };
  }
  componentDidMount() {
    // Get the id and key from the url
    // Perform request for the static file
    // Generate download
    start.bind(this)();
    async function start() {
      try {
        this.setState({ loading: true });
        const { key, id } = getParamsFromUrl();
        const url = `${baseUrl}/cred/${id}`;
        const encryptedFile = await fetch(url).then(res => res.text());

        if (!isBase64(encryptedFile)) {
          throw Error(`Fetched file at ${url} is not base64: ${encryptedFile}`);
        }
        const file = decrypt(encryptedFile, key);
        this.setState({ loading: false, file });
        console.log(file);
      } catch (err) {
        this.setState({
          loading: false,
          error: err.message || "Unknown error"
        });
        console.error("Error resolving request", err);
      }
    }
  }

  render() {
    const { file, error, loading } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {file ? (
            <Ready file={file} />
          ) : error ? (
            <Error error={error} />
          ) : loading ? (
            <Loading />
          ) : (
            <Fallback />
          )}
        </header>
      </div>
    );
  }
}

export default App;
