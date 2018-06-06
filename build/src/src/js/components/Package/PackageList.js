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
    let id = this.props._package.name
    let state = this.props._package.state

    let toggleButtonTag = ''
    if (state == 'running') toggleButtonTag = 'Pause'
    if (state == 'exited') toggleButtonTag = 'Start'

    let dotClass = 'text-danger'
    if (state == 'running') dotClass = 'text-success'

    return (
      <tr id={id}>
        <td><a href={'http://my.'+this.props._package.name}>{'my.'+this.props._package.name}</a></td>
        <td>{this.props._package.version}</td>
        <td>
          <span className={classNames("small", "state-light", dotClass)}>⬤  </span>
          <span className="state-label">{state}</span>
        </td>
        <td>{this.props._package.ports}</td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link
              class="btn btn-outline-secondary tableAction-button"
              to={'package/'+this.props._package.shortName}
              >
              Settings
            </Link>
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
    let DNProws = [];
    this.props.packageList.filter(p => p.isDNP).map((_package, i) => {
      DNProws.push(
        <Row key={i}
          _package={_package}
          removePackage={this.props.removePackage}
          togglePackage={this.props.togglePackage}
          logPackage={this.props.logPackage}
        />
      );
    })

    let CORErows = [];
    this.props.packageList.filter(p => p.isCORE).map((_package, i) => {
      CORErows.push(
        <Row key={i}
          _package={_package}
          removePackage={this.props.removePackage}
          togglePackage={this.props.togglePackage}
          logPackage={this.props.logPackage}
        />
      );
    })

    return (
      <div>
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
          <tbody>
            <tr>
              <th colSpan="4">DNP packages</th>
            </tr>
            {DNProws}
            <tr>
              <th colSpan="4">CORE packages</th>
            </tr>
            {CORErows}
          </tbody>
        </table>
      </div>
    );
  }
}
