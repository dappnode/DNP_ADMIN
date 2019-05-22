import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
// Components
import CardList from "components/CardList";
import SubTitle from "components/SubTitle";
import Button from "components/Button";
// Utils
import { toLowercase } from "utils/strings";

function PackageControls({
  dnp,
  togglePackage,
  restartPackage,
  restartPackageVolumes,
  removePackage
}) {
  const state = toLowercase(dnp.state); // toLowercase always returns a string

  const actions = [
    {
      name:
        state === "running" ? "Pause" : state === "exited" ? "Start" : "Toggle",
      text: "Toggle the state of the package from running to paused",
      action: () => togglePackage(dnp.name),
      availableForCore: false,
      type: "secondary"
    },
    {
      name: "Restart",
      text:
        "Restarting a package will interrupt the service during 1-10s but preserve its data",
      action: () => restartPackage(dnp.name),
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
      action: () => restartPackageVolumes(dnp.name),
      availableForCore: true,
      type: "danger"
    },
    {
      name: "Remove ",
      text: "Deletes a package permanently.",
      action: () => removePackage(dnp.name),
      availableForCore: false,
      type: "danger"
    }
  ];

  // Table style -> Removes the space below the table, only for tables in cards
  return (
    <>
      <SubTitle>Controls</SubTitle>
      <CardList>
        {actions
          .filter(action => action.availableForCore || !dnp.isCore)
          .map(({ name, text, type, action }) => (
            <div key={name} className="control-item">
              <div>
                <strong>{name}</strong>
                <div>{text}</div>
              </div>
              <Button
                variant={`outline-${type}`}
                onClick={action}
                style={{ whiteSpace: "normal" }}
              >
                {name}
              </Button>
            </div>
          ))}
      </CardList>
    </>
  );
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
