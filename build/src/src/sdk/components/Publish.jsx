import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { validateRepoName, updateQuery, connect, publish } from "../actions";
import { createStructuredSelector } from "reselect";
import { NAME } from "../constants";
import { Link } from "react-router-dom";
import { parseUrlQuery } from "utils/urlQuery";
import metamaskIcon from "img/metamask-white.png";
import newTabProps from "utils/newTabProps";
// packages
import installer from "installer";

const ipfsGateway = "http://my.ipfs.dnp.dappnode.eth:8080/ipfs/";

// Necessary code to refresh the userAddress
// when user interacts with the metamask extension
let configureMetamaskListeners = cb => {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", accounts => {
    cb("userAccount", accounts[0]);
  });
  // Singleton
  configureMetamaskListeners = () => {};
};

const paramMapping = {
  r: "dnpName",
  v: "version",
  d: "developerAddress",
  h: "manifestIpfsHash"
};

class Publish extends React.Component {
  componentDidMount() {
    const urlQuery = this.props.match.params.urlQuery;
    if (urlQuery) {
      try {
        const params = parseUrlQuery(urlQuery);
        console.log(
          "A prefilled link was found for the SDK Publish, params:",
          params
        );
        Object.keys(paramMapping).forEach(key => {
          if (params[key])
            this.props.updateQuery(paramMapping[key], params[key]);
        });
      } catch (e) {
        console.error(`Error parsing urlQuery "${urlQuery}": ${e.stack}`);
      }
    }
    configureMetamaskListeners(this.props.updateQuery.bind(this));
  }

  render() {
    const id = "Publish";

    const buttonInput = this.props.buttonInput;
    const showManifestButtons = this.props.showManifestButtons;
    const manifestHash = (showManifestButtons || "").split("ipfs/")[1];
    const disablePublish = this.props.disablePublish;

    const txPreview = this.props.txPreview;

    const getInputClass = ({ loading, success, error }) =>
      loading ? "is-loading" : error ? "is-invalid" : success ? "is-valid" : "";

    return (
      <React.Fragment>
        <div className="section-title">
          <span
            style={{
              opacity: 0.3,
              fontWeight: 300,
              textTransform: "uppercase"
            }}
          >
            {NAME}{" "}
          </span>
          {id}
        </div>

        <div className="section-subtitle">Transaction details</div>
        <div className="card mb-3">
          <div className="card-body">
            <form>
              {/* Main rows of the form */}
              {this.props.formFields.filter(({ hide }) => !hide).map(item => {
                return (
                  <div className="form-group row" key={item.id}>
                    <label
                      htmlFor={`form-${item.id}`}
                      className="col-sm-2 col-form-label"
                    >
                      {item.name}
                    </label>
                    <div className="col-sm-10">
                      <input
                        className={`form-control ${getInputClass(item)}`}
                        placeholder={item.placeholder}
                        value={(this.props.query || {})[item.id] || ""}
                        onChange={e =>
                          this.props.updateQuery(item.id, e.target.value)
                        }
                      />
                      {!item.loading && item.success ? (
                        <div className="valid-feedback">
                          {item.success.map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {!item.loading && item.error ? (
                        <div className="invalid-feedback">
                          {item.error.map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <small className="form-text text-muted">
                        {item.loading ? "Loading... " : ""}
                        {item.help}
                      </small>
                    </div>
                  </div>
                );
              })}

              {/* Extra buttons to test manifest */}
              {showManifestButtons ? (
                <div className="form-group row">
                  <div className="col-sm-2" />
                  <div className="col-sm-10">
                    <a
                      className="dappnode-btn-outline mr-3"
                      href={`${ipfsGateway}${manifestHash}`}
                      {...newTabProps}
                    >
                      Open manifest
                    </a>
                    <Link
                      style={{ color: "inherit", textDecoration: "inherit" }}
                      to={`/${installer.constants.NAME}/ipfs:${manifestHash}`}
                    >
                      <button className="dappnode-btn-outline">
                        Install DNP
                      </button>
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Transaction preview code box */}
              {!disablePublish && txPreview ? (
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-secondary">
                    Transaction preview
                  </label>
                  <div className="col-sm-10">
                    <div
                      className="error-stack"
                      style={{
                        whiteSpace: "inherit"
                      }}
                    >
                      {Object.keys(txPreview).map(key => (
                        <span key={key}>
                          {`${key}: ${txPreview[key]}`}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Publish button */}
              <div className="form-group row">
                <div className="col-sm-10">
                  {buttonInput.connected ? (
                    <button
                      className="dappnode-btn"
                      disabled={disablePublish}
                      onClick={this.props.publish}
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      className="dappnode-btn"
                      onClick={this.props.connect}
                    >
                      <img src={metamaskIcon} alt="" className="metamaskIcon" />{" "}
                      Connect
                    </button>
                  )}
                  {buttonInput.connected && buttonInput.error ? (
                    <div className={`feedback-error`}>
                      {buttonInput.error.join("\n")}
                    </div>
                  ) : buttonInput.connected && buttonInput.success ? (
                    <div className={`feedback-success`}>
                      {buttonInput.success.join("\n")}
                    </div>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  registries: selector.registries,
  repoNames: selector.repoName,
  query: selector.query,
  queryResult: selector.queryResult,
  formFields: selector.getInputFields,
  buttonInput: selector.getButtonInput,
  disablePublish: selector.getDisablePublish,
  showManifestButtons: selector.getShowManifestButtons,
  txPreview: selector.getTransactionPreview
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  validateRepoName,
  updateQuery,
  connect,
  publish
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Publish);
