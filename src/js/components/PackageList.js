import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr id={this.props.id}>

        <td>{this.props.name}</td>
        <td>{this.props.id}</td>
        <td>
          <button class='bttn'
            id={this.props.id}
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
    console.log(this.props)
    let rows = [];
    for (let i = 0; i < this.props.packageList.length; i++) {
      let _package = this.props.packageList[i];
      rows.push(
        <Row
          name={_package.name}
          id={_package.id}
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
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
