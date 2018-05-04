import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let id = this.props.package.id;
    return (
      <tr id={id}>
        <td>{this.props.package.name}</td>
        <td>{this.props.package.version}</td>
        <td>{String(this.props.package.running)}</td>
        <td>{this.props.package.ports}</td>
        <td>
          <button class='bttn'
            id={id}
            onClick={this.props.removePackage}
          >remove</button>
        </td>
      </tr>
    );
  }
}

export default class PackageList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rows = [];
    for (let i = 0; i < this.props.packageList.length; i++) {
      let _package = this.props.packageList[i];
      rows.push(
        <Row
          package={_package}
          key={i}
          removePackage={this.props.removePackage}
        />
      );
    }

    return (
      <div>
        <h1>Package list</h1>
        <table class='Table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>version</th>
              <th>running</th>
              <th>ports</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
