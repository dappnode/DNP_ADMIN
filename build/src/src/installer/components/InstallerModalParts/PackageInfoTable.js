import React from "react";
import PropTypes from "prop-types";

export default class PackageInfoTable extends React.Component {
  render() {
    // verify manifest's integrity
    let manifest = this.props.manifest;
    if (!manifest) return null;
    if (typeof manifest === typeof "string")
      return (
        <div className="alert alert-danger" role="alert">
          Error fetching manifest: {manifest}
        </div>
      );
    else if (typeof manifest !== typeof {})
      return (
        <div className="alert alert-danger" role="alert">
          Broken package manifest
        </div>
      );
    else if (manifest.hasOwnProperty("error") && manifest.error) {
      return (
        <div className="alert alert-danger" role="alert">
          Error fetching manifest: {JSON.stringify(manifest.message)}
        </div>
      );
    }

    let tableItems = [
      { key: "Description", val: manifest.description || "" },
      { key: "Mantainer", val: manifest.author || "" },
      { key: "Type", val: manifest.type || "" },
      { key: "Size", val: manifest.image ? manifest.image.size || "" : "" },
      {
        key: "Image hash",
        val: manifest.image ? manifest.image.hash || "" : ""
      }
    ];

    let rows = tableItems.map((row, i) => {
      return (
        <tr key={i}>
          <th scope="row">{row.key}</th>
          <td>{row.val}</td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table">
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

PackageInfoTable.propTypes = {
  manifest: PropTypes.object.isRequired
};
