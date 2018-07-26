import React from "react";
import PropTypes from "prop-types";
import humanFileSize from "utils/humanFileSize";

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
      { key: "Name", val: manifest.name || "" },
      { key: "Description", val: manifest.description || "" },
      { key: "Version", val: manifest.version || "" },
      { key: "Mantainer", val: manifest.author || "" },
      { key: "Type", val: manifest.type || "" },
      {
        key: "Size",
        val: manifest.image ? humanFileSize(manifest.image.size) || "" : ""
      }
    ];

    let rows = tableItems.map((row, i) => {
      let style = i === 0 ? { borderTopWidth: "0" } : {};
      return (
        <tr key={i}>
          <th scope="row" style={style}>
            {row.key}
          </th>
          <td style={style}>{row.val}</td>
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
