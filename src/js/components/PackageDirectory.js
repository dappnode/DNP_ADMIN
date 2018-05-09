import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let versions = this.props.package.versions

    let options = versions.map((version, i) => {
      return <option key={i}>{version}</option>
    })

    let id = this.props.package.name;
    return (
      <tr>
        <td>{this.props.package.name}</td>
        <td>{this.props.package.status}</td>
        <td>
          <div class="input-group mb-3">
            <select class="form-control custom-select"
              id={id+'@version'}
              >
                {options}
            </select>
            <div class="input-group-append">
              <label class="input-group-text" for={id+'@version'}
                id={id}
                onClick={this.props.installPackage}
                >
                  Install
              </label>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export default class PackageDirectory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rows = [];
    for (let i = 0; i < this.props.directory.length; i++) {
      let _package = this.props.directory[i];
      rows.push(
        <Row
          package={_package}
          key={i}
          installPackage={this.props.installPackage}
        />
      );
    }

    return (
      <div>
        <table class='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Versions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
