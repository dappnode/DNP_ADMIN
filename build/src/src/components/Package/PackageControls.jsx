import React from "react";

export default class PackageControls extends React.Component {
  togglePackage(e) {
    this.props.togglePackage(this.props.id, this.props.isCORE);
  }
  restartPackage(e) {
    this.props.restartPackage(this.props.id, this.props.isCORE);
  }
  restartVolumes(e) {
    this.props.restartPackageVolumes(this.props.id, this.props.isCORE);
  }
  removePackage(e) {
    this.props.removePackage(this.props.id, false);
  }
  removePackageAndVolumes(e) {
    this.props.removePackage(this.props.id, true);
  }

  render() {
    let state = this.props.state;
    let toggleButtonTag = "";
    if (state === "running") toggleButtonTag = "Pause";
    if (state === "exited") toggleButtonTag = "Start";

    const actions = [
      {
        name: toggleButtonTag,
        text: "Toggle the state of the package from running to paused",
        action: this.togglePackage.bind(this),
        availableForCore: false,
        type: "secondary"
      },
      {
        name: "Restart",
        text:
          "Restarting a package will interrupt the service during 1-10s but preserve its data",
        action: this.restartPackage.bind(this),
        availableForCore: true,
        type: "danger"
      },
      {
        name: "Remove volumes",
        text:
          "Deleting this package volumes is a permanent action and all data will be lost. In the case of the ethcahin core package, resyncing may take a few days",
        action: this.restartVolumes.bind(this),
        availableForCore: true,
        type: "danger"
      },
      {
        name: "Remove ",
        text:
          "Deletes a package permanently. All data not stored in volumes will be lost.",
        action: this.removePackage.bind(this),
        availableForCore: false,
        type: "danger"
      },
      {
        name: "Remove + data",
        text:
          "Deletes a package and all its data permanently. Data stored in volumes will be also deleted",
        action: this.removePackageAndVolumes.bind(this),
        availableForCore: false,
        type: "danger"
      }
    ];

    const rows = actions
      .filter(action => action.availableForCore || !this.props.isCORE)
      .map((action, i) => {
        // Remove the top border from the first row only
        const style = i ? {} : { borderTop: "none" };
        return (
          <tr key={i}>
            <td style={style}>
              <strong>{action.name}</strong>
              <br />
              {action.text}
            </td>
            <td style={{ ...style, textAlign: "right" }}>
              <button
                type="button"
                className={
                  "btn btn-outline-" + action.type + " tableAction-button"
                }
                onClick={action.action}
              >
                {action.name}
              </button>
            </td>
          </tr>
        );
      });

    // Table style -> Removes the space below the table, only for tables in cards
    return (
      <div className="border-bottom mb-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h4>Package controls</h4>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <table
              className="table table-hover table-responsive"
              style={{ marginBottom: "0" }}
            >
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
