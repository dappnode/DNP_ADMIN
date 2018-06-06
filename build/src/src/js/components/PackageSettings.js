import React from "react"
import params from "Params"
import ClipboardJS from 'clipboard'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

new ClipboardJS('.btn')

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let id = this.props.package.name
    let state = this.props.package.state

    let toggleButtonTag = ''
    if (state == 'running') toggleButtonTag = 'Pause'
    if (state == 'exited') toggleButtonTag = 'Start'

    let dotClass = 'text-danger'
    if (state == 'running') dotClass = 'text-success'

    return (
      <tr id={id}>
        <td>{this.props.package.name}</td>
        <td>{this.props.package.version}</td>
        <td>
          <span className={classNames("small", "state-light", dotClass)}>⬤  </span>
          <span className="state-label">{state}</span>
        </td>
        <td>{this.props.package.ports}</td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-secondary tableAction-button"
              id={id}
              onClick={this.props.togglePackage}
            >{toggleButtonTag}</button>
            <button type="button" class="btn btn-outline-secondary tableAction-button"
              id={id}
              onClick={this.props.logPackage}
            >Logs</button>
            <button type="button" class="btn btn-outline-danger tableAction-button"
              id={id}
              onClick={this.props.removePackage}
            >Remove</button>
          </div>
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
          togglePackage={this.props.togglePackage}
          logPackage={this.props.logPackage}
        />
      );
    }

    return (
      <div class="table-responsive">
        <table class='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>State</th>
              <th>Ports</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
