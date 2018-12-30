import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import { NAME } from "../constants";
import semver from "semver";
import isIpfsHash from "utils/isIpfsHash";
import { parseUrlQuery, stringifyUrlQuery } from "utils/urlQuery";
import web3Utils from "web3-utils";

window.stringifyUrlQuery = stringifyUrlQuery;

const paramMapping = {
  r: "dnpName",
  v: "version",
  d: "developerAddress",
  h: "ipfsHash"
};

console.log(
  stringifyUrlQuery({
    r: "admin.dnp.dappnode.eth",
    v: "0.1.16",
    h: "/ipfs/QmSDgpiHco5yXdyVTfhKxr3aiJ82ynz8V14QcGKicM3rVh"
  })
);

function getDnpNameInput(query, queryResult) {
  const dnpName = query.dnpName;
  const dnpNameQueryResult = queryResult.dnpName || {};
  const { value, registryAddress, repoAddress } = dnpNameQueryResult;
  // Compute is loading
  let loading = dnpName && value !== dnpName;
  if (loading) return { loading };
  // Compute error messages
  let error = [];
  let success = [];
  if (dnpName) {
    if (dnpName && !(dnpName || "").includes("."))
      error.push(`"${dnpName}" is not a valid ENS domain`);
    if (registryAddress) success.push(`Registry found: ${registryAddress}`);
    else error.push(`"${value}" does not have a valid registry`);
    if (repoAddress) success.push(`Repo already deployed at: ${repoAddress}`);
    else success.push(`A new repo will be deployed for the DNP "${value}"`);
  }

  if (!error.length) error = null;
  if (!success.length) success = null;
  console.log(success);
  return { loading, error, success };
}

function getDeveloperAddressInput(query, queryResult) {
  const developerAddress = query.developerAddress;
  const dnpNameQueryResult = queryResult.dnpName || {};
  const { value, registryAddress, repoAddress } = dnpNameQueryResult;
  const active = registryAddress && !repoAddress;
  // Compute error messages
  let error = [];
  let success = [];
  if (developerAddress) {
    if (web3Utils.isAddress(developerAddress)) success.push(`Valid address`);
    else error.push("Must be a valid ethereum address");
  }

  if (!error.length) error = null;
  if (!success.length) success = null;
  return { hide: !active, error, success };
}

function getVersionInput(query, queryResult) {
  const version = query.version;
  const versionQueryResult = queryResult.version || {};
  const { value, registryAddress } = versionQueryResult;
  // Compute error messages + success message
  let error = [];
  let success = [];
  if (version) {
    if (semver.valid(version)) success.push(`Valid version`);
    else error.push("Sematic version must be valid, i.e. 0.1.7");
  }

  if (!success.length) success = null;
  if (!error.length) error = null;
  return { error, success };
}

function getManifestHashInput(query, queryResult) {
  const ipfsHash = query.ipfsHash;
  const ipfsHashQueryResult = queryResult.ipfsHash || {};
  const { value, registryAddress } = ipfsHashQueryResult;
  // If no input is set, return nothing
  if (!ipfsHash) return {};
  // Compute error messages
  let error = [];
  let success = [];
  if (ipfsHash) {
    if (isIpfsHash(ipfsHash)) success.push(`Valid ipfs hash`);
    else error.push("Manifest hash must be a valid IPFS hash");
  }

  if (!error.length) error = null;
  if (!success.length) success = null;
  return { error, success };
}

class Publish extends React.Component {
  componentDidMount() {
    const urlQuery = this.props.match.params.urlQuery;
    if (urlQuery) {
      try {
        const params = parseUrlQuery(urlQuery);
        console.log("urlQuery", urlQuery, "params", params);
        Object.keys(paramMapping).forEach(key => {
          if (params[key])
            this.props.updateQuery(paramMapping[key], params[key]);
        });
      } catch (e) {
        console.error(`Error parsing urlQuery "${urlQuery}": ${e.stack}`);
      }
    }
  }

  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const id = "Publish";

    const tx = {
      From: "0xF35960302a07022aBa880DFFaEC2Fdd64d5BF1c1",
      To: "0x1234acbd",
      Value: 0,
      Data: "0x0000000000000000000234234323223ba32ba3b32a3a32",
      "Gas limit": 300000
    };

    const query = this.props.query;
    const { dnpName, version, ipfsHash } = query;
    const queryResult = this.props.queryResult;

    const formFields = [
      {
        id: "dnpName",
        value: query.dnpName,
        name: "DNP name",
        placeholder: "full ENS name",
        help:
          "Full ENS name of the DNP to update, i.e. timeapp.public.dappnode.eth",
        ...getDnpNameInput(query, queryResult)
      },
      {
        id: "developerAddress",
        value: query.developerAddress,
        name: "Developer address",
        placeholder: "Ethereum address",
        help:
          "Ethereum address of the developer address that will control this repo",
        ...getDeveloperAddressInput(query, queryResult)
      },
      {
        id: "version",
        value: query.version,
        name: "Next version",
        placeholder: "Semantic version",
        help: "Semantic version about to be published, i.e. 0.1.7",
        ...getVersionInput(query, queryResult)
      },
      {
        id: "ipfsHash",
        value: query.ipfsHash,
        name: "Manifest hash",
        placeholder: "IPFS multihash",
        help:
          "Multihash content address of the manifest. Must be in the format /ipfs/[multihash], i.e. /ipfs/QmSDgpiHco5yXdyVTfhKxr3aiJ82ynz8V14QcGKicM3rVh",
        ...getManifestHashInput(query, queryResult)
      }
    ];

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
              {formFields
                .filter(({ hide }) => !hide)
                .map(
                  ({
                    id,
                    value,
                    name,
                    placeholder,
                    help,
                    loading,
                    success,
                    error
                  }) => {
                    const result = queryResult[id] || {};
                    const inputClass = result.valid ? "is-valid" : "is-invalid";
                    return (
                      <div className="form-group row" key={id}>
                        <label
                          htmlFor={`form-${id}`}
                          className="col-sm-2 col-form-label"
                        >
                          {name}
                        </label>
                        <div className="col-sm-10">
                          <input
                            className={`form-control ${
                              loading
                                ? "is-loading"
                                : error
                                  ? "is-invalid"
                                  : success
                                    ? "is-valid"
                                    : ""
                            }`}
                            id={`form-${id}`}
                            placeholder={placeholder}
                            value={value || ""}
                            onChange={e =>
                              this.props.updateQuery(id, e.target.value)
                            }
                          />
                          {!loading && success ? (
                            <div className="valid-feedback new-line">
                              {success.join("\n")}
                            </div>
                          ) : null}
                          {!loading && error ? (
                            <div className="invalid-feedback new-line">
                              {error.join("\n")}
                            </div>
                          ) : null}
                          <small className="form-text text-muted">
                            {loading ? "Loading... " : ""}
                            {help}
                          </small>
                        </div>
                      </div>
                    );
                  }
                )}

              <div className="form-group row">
                <div className="col-sm-10">
                  <button
                    type="submit"
                    className="btn dappnode-background-color"
                    disabled={Boolean(
                      formFields.reduce(
                        (disable, field) => disable || !field.success,
                        false
                      )
                    )}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
            {/*  */}
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
  queryResult: selector.queryResult
});

const mapDispatchToProps = dispatch => {
  return {
    validateRepoName: repoName => {
      dispatch(action.validateRepoName(repoName));
    },
    updateQuery: (id, value) => {
      dispatch(action.updateQuery(id, value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Publish);
