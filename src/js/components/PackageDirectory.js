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
          <select class="form-control" id={id+'@version'}>
            {options}
          </select>
        </td>
        <td>
          <button class='bttn'
            id={id}
            onClick={this.props.installPackage}
          >install</button>
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
        <h1>Package Directory</h1>
        <table class='Table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>status</th>
              <th>versions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
