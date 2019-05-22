import React from "react";
import { connect } from "react-redux";
import * as a from "../../../actions";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Button from "components/Button";

/**
 * curl "http://ipfs.dappnode:5001/api/v0/id"
 * {
 *   ID: "QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *   PublicKey: "AsDFGHJkKjHGfDsQwErTyUiKNDsdFGhjKkJhGFdSeRtYUiJhFDsdfGHjIGcG/bGeEo3+BYjFkjMLor/thjk8wq4chVNCj+VH8RuKzQrkCJr++1i3NFHpJaRsy0zuXPWRJcO2sRVJn6ZMUG1lM/cFlpBpb3VSj1AFeoIXec547Bz36Q7AQdKWxwskRBJ1gCo0unJ4lsBBongstuywTtPReLbki+jb3OgOwcfiRM/uq/kP0bq6rBzLRx0d5cYIo4cQdoN4IaL/99TEKji/sLOPZEQdzYq0UV6yk3uTpza9pq1kL6Nd4obY6F1QW7BUw/vunxHMThtD+j1+5M84FHLFWjRaoOnhJ6PLLzM0f40FOOvLUzdwdDm4eBXBjUZpWUO+mpoOAkwxAgMBAAE=",
 *   Addresses: [
 *     "/ip4/127.0.0.1/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *     "/ip4/172.33.1.5/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *     "/ip4/86.230.95.64/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer"
 *   ],
 *   AgentVersion: "go-ipfs/0.4.20/8efc82534",
 *   ProtocolVersion: "ipfs/0.1.0"
 * }
 *
 * curl "http://ipfs.dappnode:5001/api/v0/bootstrap/add?arg=/dnsaddr/bacd1423acdb6231.dyndns.dappnode.io/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer"
 * {
 *   "Peers":[ "/dnsaddr/bacd1423acdb6231.dyndns.dappnode.io/tcp/4001/ipfs/QmWAcZZCvqVnJ6J9946qxEMaAbkUj6FiiVWakizVKfnfDL" ]
 * }
 *
 * Multiaddress possible prefixes:
 * - /ip4/
 * - /dns4/
 * - /dnsaddr/
 */

function IpfsDnpDappnodeEth({ cleanCache }) {
  return (
    <>
      <SubTitle>Clean cache</SubTitle>
      <Card>
        <div className="help-text" style={{ marginBottom: "1rem" }}>
          Remove the local cache of Aragon Package Manager (APM) entries,
          manifests, avatars. Also remove the user action logs shown in the
          Activity tab.
        </div>

        <Button onClick={cleanCache}>Clean cache</Button>
      </Card>
    </>
  );
}

const mapDispatchToProps = {
  cleanCache: a.cleanCache
};

// withLoading is applied at DevicesRoot
export default connect(
  null,
  mapDispatchToProps
)(IpfsDnpDappnodeEth);
