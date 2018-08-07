import React from "react";

export default class PackageControls extends React.Component {
  render() {
    let state = this.props.state;
    let toggleButtonTag = "";
    if (state === "running") toggleButtonTag = "Pause";
    if (state === "exited") toggleButtonTag = "Start";

    const actions = [
      {
        name: "Restart",
        text:
          "Restarting a package will interrupt the service during 1-10s but preserve its data",
        action: this.props.restartPackage,
        availableForCore: true,
        type: "danger"
      },
      {
        name: "Remove volumes",
        text:
          "Deleting this package volumes is a permanent action and all data will be lost. In the case of the ethcahin core package, resyncing may take a few days",
        action: this.props.restartPackageVolumes,
        availableForCore: true,
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
