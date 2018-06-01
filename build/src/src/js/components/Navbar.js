import React from 'react'
import { NavLink } from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import AppStore from 'Store'

import LogoImg from '../../img/DAppNode-Black.png'
// Icons
import Devices from './Icons/Devices'
import Dashboard from './Icons/Dashboard'
import Folder from './Icons/Folder'
import NewFolder from './Icons/NewFolder'
import Circle from './Icons/Circle'
import Bell from './Icons/Bell'
import Chain from './Icons/Chain'
import Link from './Icons/Link'

// FontAwesome.FaTachometerAlt
// FontAwesome.FaMobileAlt
// FontAwesome.FaPlusSquare
// FontAwesome.FaBox
// FontAwesome.FaChartLine

let navbarItemsInfo = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Dashboard
  },
  {
    name: 'Devices',
    href: '/devices',
    icon: Devices
  },
  {
    name: 'Installer',
    href: '/installer',
    icon: NewFolder
  },
  {
    name: 'Packages',
    href: '/packages',
    icon: Folder
  }
]

class DropdownIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a class="nav-link dropdown-toggle mr-lg-2" id={this.props.name+"Dropdown"} href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <this.props.icon />
        <span class="d-lg-none">
          {this.props.name}
          <span class={"badge badge-pill badge-"+this.props.type}>·</span>
        </span>
        <span class={"indicator d-none d-lg-block text-"+this.props.type}>
          <Circle scale={1.3}/>
        </span>
      </a>
    )
  }
}
// name={'messages'}

let alerts = [
  {
    title: 'Package Error',
    rightText: '11:21 AM',
    body: 'otpweb.dnp.dappnode.eth has exited',
    type: 'danger'
  },
  {
    title: 'Disk space almost full',
    rightText: '13:45 AM',
    body: 'With no diskspace, DAppnode will crash',
    type: 'warning'
  }
]


class NavbarTopDropdownMessages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let globalType = 'success'
    let messageTypes = this.props.messages.map(message => message.type || '')
    if (messageTypes.includes('danger')) globalType = 'danger'
    else if (messageTypes.includes('warning')) globalType = 'warning'

    let listItems = this.props.messages.map((message, i) => {
      let type = message.type || 'default'
      let rightText = message.rightText || ''
      return (
        <div key={i}>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">
            <span class={"text-"+type}>
              <strong>{message.title}</strong>
            </span>
            <span class="small float-right text-muted">{rightText}</span>
            <div class="dropdown-message small">{message.body}</div>
          </a>
        </div>
      )
    })
    return (
      <li class="nav-item dropdown">
        <DropdownIcon
          type={globalType}
          name={this.props.name}
          icon={this.props.icon}
        />
        <div class="dropdown-menu" aria-labelledby="messagesDropdown">
          <h6 class="dropdown-header">{this.props.name}:</h6>
          {listItems}
        </div>
      </li>
    )
  }
}


class NavbarTop extends React.Component {
  constructor() {
    super();
    this.state = {
      chainStatus: AppStore.getChainStatus()
    }
    this.updateChainStatus = this.updateChainStatus.bind(this)
  }
  componentDidMount() {
    AppStore.on(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
  }
  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.CHANGE_CHAINSTATUS, this.updateChainStatus);
  }
  updateChainStatus() {
    this.setState({
      chainStatus: AppStore.getChainStatus()
    });
  }

  render() {
    let ethchainNames = Object.getOwnPropertyNames(this.state.chainStatus)
    let chainInfo = ethchainNames.map((ethchainName) => {
      return {
        title: this.state.chainStatus[ethchainName].name,
        body: this.state.chainStatus[ethchainName].status,
        type: this.state.chainStatus[ethchainName].type
      }
    })

    // ###### This code is to incorporate the bell again

    // <NavbarTopDropdownMessages
    //   name={'Alerts'}
    //   messages={alerts}
    //   icon={Bell}
    // />

    return (
      <ul class="navbar-nav ml-auto">

        <NavbarTopDropdownMessages
          name={'ChainStatus'}
          messages={chainInfo}
          icon={Link}
        />
        <li class="nav-item nav-item-infoText">
          <a href="https://dappnode.io/" class="nav-link">About</a>
        </li>
        <li class="nav-item nav-item-infoText">
          <a href="https://leaderboard.dappnode.io/" class="nav-link">Donate</a>
        </li>
      </ul>
    )
  }
}

class NavbarSide extends React.Component {
  constructor() {
    super();
  }

  render() {
    let navbarItems = navbarItemsInfo.map((item, i) => {
      return (
        <li key={i} class="nav-item nav-item-bigger" data-toggle="tooltip" data-placement="right" title={item.name}>
          <NavLink
            class="nav-link"
            activeStyle={{
              backgroundColor: '#eeeeee'
             }}
            to={item.href}
            >
            <span class="nav-link-text nav-link-icon"><item.icon /></span>
            <span class="nav-link-text">{item.name}</span>
          </NavLink>
        </li>
      )
    })

    return (
      <ul class="navbar-nav navbar-sidenav navbar-sidebar-fix" id="exampleAccordion">
        <li class="nav-item">
          <div class="logo-image-container nav-link text-center">
            <img src={LogoImg} class="img-fluid" alt="Responsive image"/>
          </div>
        </li>
        {navbarItems}
      </ul>
    )
  }
}



export default class Navbar extends React.Component {
  constructor() {
    super();
  }

  render() {

    return (
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">

        <a class="navbar-brand" href="index.html">ADMIN UI</a>

        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ErrorBoundary>
            <NavbarSide />
          </ErrorBoundary>
          <ErrorBoundary>
            <NavbarTop />
          </ErrorBoundary>
        </div>

      </nav>
    );
  }
}
