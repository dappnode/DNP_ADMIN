import React, { useState, useEffect } from "react";
import { parseUrlQuery } from "../../utils/urlQuery";
import semver from "semver";
import { title, publishId } from "../../data";
// Components
import Input from "components/Input";
import Title from "components/Title";
import SubTitle from "components/SubTitle";
import Card from "components/Card";
import { stringIncludes } from "utils/strings";

function validateEnsDomain(domain) {
  if (!domain) return null;
  return stringIncludes(domain, ".")
    ? { valid: true, message: "Valid ENS domain" }
    : { valid: false, message: "Invalid ENS domain" };
}

function validateSemver(version) {
  if (!version) return null;
  return semver.valid(version)
    ? { valid: true, message: "Valid semver" }
    : { valid: false, message: "Invalid semver" };
}

function Publish({ match }) {
  // Form input variables
  const [dnpName, setDnpName] = useState("");
  const [version, setVersion] = useState("");
  const [developerAddress, setDeveloperAddress] = useState("");
  const [manifestHash, setManifestHash] = useState("");

  /**
   * Grab the params from the URL and update local state
   * - Only once every mount, unmount
   */
  useEffect(() => {
    const { r, v, d, h } = parseUrlQuery(match.params.urlQuery);
    if (r) setDnpName(r);
    if (v) setVersion(v);
    if (d) setDeveloperAddress(d);
    if (h) setManifestHash(h);
  }, []);

  /**
   * Description of the input fields
   */
  const fields = [
    {
      id: "dnpName",
      name: "DAppNode Package name",
      placeholder: "full ENS name",
      help:
        "ENS name of the DAppNode Package to update, i.e. timeapp.public.dappnode.eth",
      value: dnpName,
      onValueChange: setDnpName,
      validations: [validateEnsDomain(dnpName)]
    },
    {
      id: "developerAddress",
      name: "Developer address",
      placeholder: "Ethereum address",
      help: "Developer's Ethereum address that will control this repo",
      value: developerAddress,
      onValueChange: setDeveloperAddress
    },
    {
      id: "version",
      name: "Next version",
      placeholder: "Semantic version",
      help: "Semantic version about to be published, i.e. 0.1.7",
      value: version,
      onValueChange: setVersion,
      validations: [validateSemver(version)]
    },
    {
      id: "manifestIpfsHash",
      name: "Manifest hash",
      placeholder: "IPFS multihash",
      help:
        "IPFS hash of the manifest. Must be in the format /ipfs/[multihash], i.e. /ipfs/QmVeaz5kR55nAiGjYpXpUAJpWvf6net4MbGFNjBfMTS8xS",
      value: manifestHash,
      onValueChange: setManifestHash
    }
  ];

  return (
    <>
      <Title title={title} subtitle={publishId} />
      <SubTitle>Transaction details</SubTitle>
      <Card className="publish-grid">
        {fields.map(
          ({ name, value, onValueChange, placeholder, validations, help }) => {
            return (
              <React.Fragment key={name}>
                <div>{name}</div>
                <div>
                  <Input {...{ value, onValueChange, placeholder }} />
                  {(validations || [])
                    .filter(x => x)
                    .map(({ valid, message }) => (
                      <div style={{ color: valid ? "green" : "red" }}>
                        {message}
                      </div>
                    ))}
                </div>
              </React.Fragment>
            );
          }
        )}
      </Card>
    </>
  );
}

export default Publish;
