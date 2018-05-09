import React from 'react'
import { NavLink } from 'react-router-dom'
import AppStore from 'Store'
import SyncStatus from './SyncStatus'

import LogoImg from 'Img/DAppNode-black.png'
import { MdDashboard, MdDevices, MdSettingsApplications,
    MdAddBox, MdCreateNewFolder, MdFolder,
  MdSync } from 'react-icons/lib/md'

import { FaCircle, FaArrowUp, FaBell, FaSync, FaChain } from 'react-icons/lib/fa'
import { GoSync } from 'react-icons/lib/go'

// FontAwesome.FaTachometerAlt
// FontAwesome.FaMobileAlt
// FontAwesome.FaPlusSquare
// FontAwesome.FaBox
// FontAwesome.FaChartLine

let navbarItemsInfo = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: MdDashboard
  },
  {
    name: 'Devices',
    href: '/devices',
    icon: MdDevices
  },
  {
    name: 'Installer',
    href: '/installer',
    icon: MdCreateNewFolder
  },
  {
    name: 'Packages',
    href: '/packages',
    icon: MdFolder
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
          <FaCircle />
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
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updateChainStatus.bind(this));
  }
  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateChainStatus.bind(this));
  }
  updateChainStatus() {
    this.setState({
      deviceList: AppStore.getChainStatus()
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

    return (
      <ul class="navbar-nav ml-auto">
        <NavbarTopDropdownMessages
          name={'Alerts'}
          messages={alerts}
          icon={FaBell}
        />
        <NavbarTopDropdownMessages
          name={'ChainStatus'}
          messages={chainInfo}
          icon={FaChain}
        />
        <li class="nav-item nav-item-infoText">
          <a class="nav-link">About</a>
        </li>
        <li class="nav-item nav-item-infoText">
          <a class="nav-link">Donate</a>
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
      <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
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
          <NavbarSide />
          <NavbarTop />
        </div>

      </nav>
    );
  }
}
