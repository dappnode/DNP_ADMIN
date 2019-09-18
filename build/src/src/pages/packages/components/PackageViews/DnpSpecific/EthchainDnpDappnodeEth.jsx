import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import api from "API/rpcMethods";
import { confirm } from "components/ConfirmDialog";
import { NavLink } from "react-router-dom";
// Components
import Card from "components/Card";
import Button from "components/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
// Images
import ethereumLogo from "img/logos/ethereum-logo.png";
import parityLogo from "img/logos/parity-logo.png";
// Styles
import "./ethchainDnpDappnodeEth.scss";
// Selectors
import { getEthchainClient } from "services/dnpInstalled/selectors";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";

const name = "ethchain.dnp.dappnode.eth";
const envName = "DEFAULT_CLIENT";
const updateCoreLink = systemRootPath + "/" + updatePath;

function EthchainDnpDappnodeEth({ ethchainClient }) {
  const [working, setWorking] = useState(false);

  async function updateClient(clientName) {
    try {
      const volumeId =
        clientName === "Geth"
          ? "dncore_ethchaindnpdappnodeeth_geth"
          : "dncore_ethchaindnpdappnodeeth_data";
      const envValue = clientName === "Geth" ? "GETH" : "PARITY";

      const currentClient = ethchainClient;
      const shouldRemoveVolumes = await new Promise(resolve =>
        confirm({
          title: `Changing Ethchain client`,
          text: `Do you want to remove the data of ${currentClient}? If you do, you will not be able to recover it and if you switch back to ${currentClient} it will have to sync from scratch.`,
          buttons: [
            {
              label: "Keep volumes",
              onClick: () => resolve(false)
            },
            {
              label: "Remove volumes",
              onClick: () => resolve(true),
              variant: "outline-danger"
            }
          ]
        })
      );

      setWorking(true);

      if (shouldRemoveVolumes)
        await api.restartPackageVolumes(
          { id: name, volumeId },
          { toastMessage: `Removing Ethchain ${currentClient} data...` }
        );

      await api.updatePackageEnv(
        { id: name, envs: { [envName]: envValue }, restart: true },
        { toastMessage: `Setting Ethchain client to ${clientName}...` }
      );
    } catch (e) {
      console.error(`Error on updateClient: ${e.stack}`);
    } finally {
      setWorking(false);
    }
  }

  if (!ethchainClient)
    return (
      <p style={{ opacity: 0.5, textAlign: "center" }}>
        You have an old version of Ethchain that does not support choosing its
        client. <br />
        Please <NavLink to={updateCoreLink}>update your system</NavLink>.
      </p>
    );

  const options = [
    { name: "Geth", logo: ethereumLogo },
    { name: "Parity", logo: parityLogo }
  ];

  return (
    <Card className="ethchain-choose-client">
      <div className="help-text" style={{ marginBottom: "1rem" }}>
        Choose the Ethereum mainnet client to run in the Ethchain package. Both
        clients have similar JSON RPC API, therefore it does not matter for your
        DApps which one is running.
      </div>

      <ButtonGroup>
        {options.map(({ name, logo }) => (
          <Button
            key={name}
            variant={
              name === ethchainClient ? "secondary" : "outline-secondary"
            }
            onClick={() => updateClient(name)}
            disabled={working}
          >
            <img id={name} src={logo} alt={name} />
            <div>{name}</div>
          </Button>
        ))}
      </ButtonGroup>
    </Card>
  );
}

const mapStateToProps = createStructuredSelector({
  ethchainClient: getEthchainClient
});

const mapDispatchToProps = null;

// withLoading is applied at DevicesRoot
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EthchainDnpDappnodeEth);
