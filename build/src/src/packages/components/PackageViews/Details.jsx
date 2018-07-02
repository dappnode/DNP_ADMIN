import React from "react";

export default class PackageDetails extends React.Component {
  render() {
    const _package = this.props._package;

    let packageProperties = [
      "name",
      "state",
      "version",
      "created",
      "image",
      "ports"
    ];
    let tableItems = packageProperties.map((prop, i) => {
      // Remove the top border from the first row only
      const style = i ? {} : { borderTop: "none" };
      return (
        <tr key={i}>
          <th style={style} scope="row">
            {prop}
          </th>
          <td style={style}>{_package[prop]}</td>
        </tr>
      );
    });

    // Table style -> Removes the space below the table, only for tables in cards
    return (
      <div className="border-bottom mb-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h4>Package details</h4>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <table
              className="table table-hover table-responsive"
              style={{ marginBottom: "0" }}
            >
              <tbody>{tableItems}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
