import React from 'react'
import { Route } from 'react-router-dom'
import DevicesInterface from './DevicesInterface'
import PackageInstallerInterface from './PackageInstallerInterface'
import PackageManagerInterface from './PackageManagerInterface'
import DashboardInterface from './DashboardInterface'
import Navbar from './Navbar'
import Home from './Home'
import Header from './Header'
import Footer from './Footer'

export default function App(props) {
  return (
    <div class="wrapper fixed-nav">
      <Navbar />
      <div class="content-wrapper">
        <div class="container-fluid app-content">
          <Route exact path='/' component={Home}/>
          <Route path='/dashboard' component={DashboardInterface}/>
          <Route path='/devices' component={DevicesInterface}/>
          <Route path='/installer' component={PackageInstallerInterface}/>
          <Route path='/packages' component={PackageManagerInterface}/>
        </div>
      </div>
    </div>
  )
}
