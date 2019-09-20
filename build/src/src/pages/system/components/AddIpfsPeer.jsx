import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
// Pages
import { rootPath as systemRootPath } from "pages/system/data";
// Components
import Card from "components/Card";
import Input from "components/Input";
import Button from "components/Button";
import Ok from "components/Ok";
import { stringIncludes } from "utils/strings";

/**
 * peer = "/dns4/1bc3641738cbe2b1.dyndns.dappnode.io/tcp/4001/ipfs/QmWAcZZCvqVnJ6J9946qxEMaAbkUj6FiiVWakizVKfnfDL"
 */

/**
 * curl "http://ipfs.dappnode:5001/api/v0/id"
 * {
 *   ID: "QmWasdappdappdapptyuioasdfghjqwertyuiasdfghjdap",
 *   PublicKey: "AsDFGHJkKjHGfDsQwErTyUiKNDsdFGhjKkJhGFdSeRtYUiJhFDsdfGHjIGcG/bGeEo3+BYjFkjMLor/thjk8wq4chVNCj+VH8RuKzQrkCJr++1i3NFHpJaRsy0zuXPWRJcO2sRVJn6ZMUG1lM/cFlpBpb3VSj1AFeoIXec547Bz36Q7AQdKWxwskRBJ1gCo0unJ4lsBBongstuywTtPReLbki+jb3OgOwcfiRM/uq/kP0bq6rBzLRx0d5cYIo4cQdoN4IaL/99TEKji/sLOPZEQdzYq0UV6yk3uTpza9pq1kL6Nd4obY6F1QW7BUw/vunxHMThtD+j1+5M84FHLFWjRaoOnhJ6PLLzM0f40FOOvLUzdwdDm4eBXBjUZpWUO+mpoOAkwxAgMBAAE=",
 *   Addresses: [
 *     "/ip4/127.0.0.1/tcp/4001/ipfs/QmWasdappdappdapptyuioasdfghjqwertyuiasdfghjdap",
 *     "/ip4/172.33.1.5/tcp/4001/ipfs/QmWasdappdappdapptyuioasdfghjqwertyuiasdfghjdap",
 *     "/ip4/85.200.85.20/tcp/4001/ipfs/QmWasdappdappdapptyuioasdfghjqwertyuiasdfghjdap"
 *   ],
 *   AgentVersion: "go-ipfs/0.4.20/8efc82534",
 *   ProtocolVersion: "ipfs/0.1.0"
 * }
 *
 * curl "http://ipfs.dappnode:5001/api/v0/bootstrap/add?arg=/dnsaddr/bacd1234acdb1234.dyndns.dappnode.io/tcp/4001/ipfs/QmWasdappdappdapptyuioasdfghjqwertyuiasdfghjdap"
 * {
 *   "Peers":[ "/dnsaddr/bacd1234acdb1234.dyndns.dappnode.io/tcp/4001/ipfs/QmWAcZZCvqVnJ6J9946qxEMaAbkUj6FiiVWakizVKfnfDL" ]
 * }
 *
 * Multiaddress possible prefixes:
 * - /ip4/
 * - /dns4/
 * - /dnsaddr/
 */

const ipfsApiUrl = "http://ipfs.dappnode:5001/api/v0";
const fetchJson = url => fetch(url).then(r => r.json());

export default function AddIpfsPeer({ match }) {
  const peerEncoded = ((match || {}).params || {}).peer || "";

  const [peerInput, setPeerInput] = useState("");
  const [addStat, setAddStat] = useState({});

  async function addSwarmConnection(peer) {
    const res = await fetchJson(`${ipfsApiUrl}/swarm/connect?arg=${peer}`);
    if (res.Type === "error") {
      console.error(`Error on addSwarmConnection:`, res);
      if (stringIncludes(res.Message, "dial attempt failed"))
        throw Error("Can't connect to peer");
      else if (stringIncludes(res.Message, "dial to self attempt"))
        throw Error("You can't add yourself");
      else throw Error(res.Message);
    }
  }

  async function addBootstrap(peer) {
    const res = await fetchJson(`${ipfsApiUrl}/bootstrap/add?arg=${peer}`);
    if (!(res.Peers || []).includes(peer)) {
      console.error(`Error on addBootstrap:`, res);
      throw Error(`Error adding bootstrap node`);
    }
  }

  const addIpfsPeer = useMemo(
    () => async peer => {
      console.log({ peer });
      try {
        if (!peer) throw Error("peer must be defined");
        setAddStat(s => ({
          ...s,
          loading: true,
          ok: false,
          msg: "Connecting to peer..."
        }));
        await addSwarmConnection(peer);
        setAddStat(s => ({
          ...s,
          loading: true,
          ok: false,
          msg: "Adding peer to boostrap list"
        }));
        await addBootstrap(peer);
        setAddStat(s => ({
          ...s,
          loading: false,
          ok: true,
          msg: "Successfully connected and saved peer"
        }));
      } catch (e) {
        console.error(`Error on addIpfsPeer (${peer}): ${e.stack}`);
        setAddStat(s => ({ ...s, loading: false, ok: false, msg: e.message }));
      }
    },
    []
  );

  useEffect(() => {
    const peerFromUrl = decodeURIComponent(peerEncoded);
    if (peerFromUrl) {
      addIpfsPeer(peerFromUrl);
      setPeerInput(peerFromUrl);
    }
  }, [peerEncoded, addIpfsPeer]);

  const { msg, ok, loading } = addStat;

  return (
    <>
      <Card spacing>
        <div>
          Add an IPFS peer to your own boostrap list and immediately connect to
          it. The easiest way to do so is to use the link generated in the{" "}
          <NavLink to={`${systemRootPath}/ipfs.dnp.dappnode.eth`}>
            IPFS packages page
          </NavLink>
          .
        </div>

        <Input
          placeholder="Peer address /ip4/85.200.85.20/tcp/4001/ipfs/QmWas..."
          value={peerInput}
          // Ensure id contains only alphanumeric characters
          onValueChange={value => {
            setAddStat(s => ({ ...s, msg: null }));
            setPeerInput(value);
          }}
          onEnterPress={() => {
            addIpfsPeer(peerInput);
          }}
          disabled={loading}
          append={
            <Button
              variant="dappnode"
              onClick={() => addIpfsPeer(peerInput)}
              disabled={loading}
            >
              Add peer
            </Button>
          }
        />

        {msg && <Ok {...{ msg, ok, loading }} style={{ marginTop: "1rem" }} />}
      </Card>
    </>
  );
}
