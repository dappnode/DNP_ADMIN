import React from 'react'
import { Route } from 'react-router-dom'
import DevicesInterface from './DevicesInterface'
import PackageInstallerInterface from './PackageInstallerInterface'
import PackageManagerInterface from './PackageManagerInterface'
import StatusInterface from './StatusInterface'
import Home from './Home'
import Header from './Header'
import Footer from './Footer'

export default function App(props) {
  return (
    <div>
      <Route exact path='/' component={Home}/>
      <Route path='/deviceManager' component={DevicesInterface}/>
      <Route path='/pakageInstaller' component={PackageInstallerInterface}/>
      <Route path='/pakageManager' component={PackageManagerInterface}/>
      <Route path='/status' component={StatusInterface}/>
    </div>
  )
}
