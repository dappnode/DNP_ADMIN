import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { createStructuredSelector } from "reselect";
// This module
import InstallerInterface from "./Installer";
import * as a from "../actions";
// Utils
import { shortNameCapitalized } from "utils/format";
import { getDnpRequest } from "services/dnpRequest/selectors";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// ### Move out
import "./stepper.scss";
import Title from "components/Title";
import { RequestedDnp } from "types";

interface InstallerContainerProps {
  id: string;
  dnp?: RequestedDnp;
  isQueryDnpUpdated: boolean;
  requiresCoreUpdate: boolean;
  progressLogs: { [dnpName: string]: string };
  install: (x: any) => void;
  clearUserSet: () => void;
  fetchPackageRequest: (id: string) => void;
}

interface InstallerRouteParams {
  id: string;
}

const InstallerContainer: React.FunctionComponent<
  InstallerContainerProps & RouteComponentProps<InstallerRouteParams>
> = ({
  match,
  // Actions
  fetchPackageRequest
}) => {
  const id = match.params.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dnp, setDnp] = useState(null as null | RequestedDnp);

  useEffect(() => {
    async function fetchDnpRequest() {
      try {
        setLoading(true);
        setError("");
        const _dnp = await fetchFakeRequest(id);
        setDnp(_dnp);
      } catch (e) {
        console.log(`Error on fetchDnpRequest: ${e.stack}`);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDnpRequest();
  }, [id, fetchPackageRequest]);

  return (
    <>
      <Title
        title="Installer"
        subtitle={dnp && dnp.name ? shortNameCapitalized(dnp.name) : id}
      />

      {dnp ? (
        <InstallerInterface dnp={dnp} progressLogs={{}} />
      ) : loading ? (
        <Loading msg={"Loading DAppNode Package data..."} />
      ) : error ? (
        <Error msg={"DAppNode Package not found"} />
      ) : null}
    </>
  );
};

async function fetchFakeRequest(id: string): Promise<RequestedDnp> {
  return {
    name: "bitcoin.dnp.dappnode.eth",
    version: "0.2.5",
    origin: null,
    avatar: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png",
    metadata: {
      name: "bitcoin.dnp.dappnode.eth",
      version: "0.2.5",
      description:
        "The Bitcoin Core daemon (0.18.0). Bitcoind is a program that implements the Bitcoin protocol for remote procedure call (RPC) use.",
      type: "service",
      style: {
        featuredBackground: "linear-gradient(to right, #4b3317, #cb6e00)",
        featuredColor: "white"
      },
      author:
        "DAppNode Association <admin@dappnode.io> (https://github.com/dappnode)",
      contributors: [
        "Abel Boldú (@vdo)",
        "Eduardo Antuña <eduadiez@gmail.com> (https://github.com/eduadiez)",
        "Loco del Bitcoin <ellocodelbitcoin@gmail.com>"
      ],
      keywords: ["bitcoin", "btc"],
      links: {
        homepage: "https://github.com/dappnode/DAppNodePackage-bitcoin#readme"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/dappnode/DAppNodePackage-bitcoin.git"
      },
      bugs: {
        url: "https://github.com/dappnode/DAppNodePackage-bitcoin/issues"
      },
      license: "GPL-3.0"
    },

    imageSize: 37273582,
    isUpdated: false,
    isInstalled: false,

    settings: {},
    request: {
      compatible: {
        requiresCoreUpdate: false,
        resolving: false,
        isCompatible: true,
        error: "",
        dnps: {
          "bitcoin.dnp.dappnode.eth": { from: "0.2.0", to: "0.2.5" }
        }
      },
      available: {
        isAvailable: true,
        message: ""
      }
    }
  };
}

// Container

const getIdFromOwnProps = (ownProps: { match?: { params: { id: string } } }) =>
  ((ownProps.match || {}).params || {}).id || "";

const mapStateToProps = createStructuredSelector({
  dnp: (state: any, ownProps: any) =>
    getDnpRequest(state, getIdFromOwnProps(ownProps))
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchPackageRequest: a.fetchPackageRequest
};

export default InstallerContainer;

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
