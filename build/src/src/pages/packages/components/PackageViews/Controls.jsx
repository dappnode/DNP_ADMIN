import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Button from "components/Button";
// Confirm UI
import confirmRemovePackage from "../confirmRemovePackage";
import { confirmAlert } from "react-confirm-alert"; // Import js
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shortName } from "utils/format";

function shortNameCapitalized(name = "") {
  const _name = shortName(name);
  return _name.charAt(0).toUpperCase() + _name.slice(1);
}

class PackageControls extends React.Component {
  confirmRemovePackageVolumes() {
    const dnp = this.props.dnp;
    confirmAlert({
      title: `Removing ${shortNameCapitalized(dnp.name)} data`,
      message: `This action cannot be undone. If this DNP is a blockchain, it will lose all the chain data and start syncing from scratch.`,
      buttons: [
        {
          label: "Cancel",
          onClick: () => {}
        },
        {
          label: "Remove volumes",
          onClick: () => this.props.restartPackageVolumes(dnp.name)
        }
      ]
    });
  }

  render() {
    const dnp = this.props.dnp;
    const state = (dnp.state || "").toLowerCase();
    const toggleButtonTag =
      state === "running" ? "Pause" : state === "exited" ? "Start" : "";

    const actions = [
      {
        name: toggleButtonTag || "Toggle",
        text: "Toggle the state of the package from running to paused",
        action: this.props.togglePackage.bind(this, dnp.name),
        availableForCore: false,
        type: "secondary"
      },
      {
        name: "Restart",
        text:
          "Restarting a package will interrupt the service during 1-10s but preserve its data",
        action: this.props.restartPackage.bind(this, dnp.name),
        availableForCore: true,
        type: "secondary"
      },
      {
        name: "Remove volumes",
        text: `Deleting package volumes is a permanent action and all data will be lost. 
          ${
            dnp.name === "ethchain.dnp.dappnode.eth"
              ? " WARNING! The mainnet chain will have to resync and may take a few days."
              : ""
          }`,
        action: this.confirmRemovePackageVolumes.bind(this, dnp.name),
        availableForCore: true,
        type: "danger"
      },
      {
        name: "Remove ",
        text: "Deletes a package permanently.",
        action: confirmRemovePackage.bind(
          this,
          dnp.name,
          this.props.removePackage.bind(this)
        ),
        availableForCore: false,
        type: "danger"
      }
    ];

    // Table style -> Removes the space below the table, only for tables in cards
    return (
      <>
        <SubTitle>Controls</SubTitle>
        <Card>
          <table className="table" style={{ marginBottom: "0" }}>
            <tbody>
              {actions
                .filter(
                  action =>
                    action.availableForCore || !(dnp.isCore || dnp.isCORE)
                )
                .map(action => (
                  <tr key={action.name} className="inter-border">
                    <td style={{ paddingLeft: 0 }}>
                      <strong>{action.name}</strong>
                      <br />
                      {action.text}
                    </td>
                    <td style={{ textAlign: "right", paddingRight: 0 }}>
                      <Button
                        variant={`outline-${action.type}`}
                        onClick={action.action}
                        style={{ width: "100px", whiteSpace: "normal" }}
                      >
                        {action.name}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  togglePackage: action.togglePackage,
  restartPackage: action.restartPackage,
  restartPackageVolumes: action.restartPackageVolumes,
  removePackage: action.removePackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageControls);
