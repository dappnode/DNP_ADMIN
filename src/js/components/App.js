import React from 'react'
import { Route } from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import DevicesInterface from './DevicesInterface'
import PackageInstallerInterface from './PackageInstallerInterface'
import PackageManagerInterface from './PackageManagerInterface'
import PackageInterface from './PackageInterface'
import DashboardInterface from './DashboardInterface'
import Navbar from './Navbar'
import Home from './Home'
import Header from './Header'
import Footer from './Footer'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App(props) {
  return (
    <div class="wrapper fixed-nav">
      <Navbar />
      <div class="content-wrapper">
        <div class="container-fluid app-content">
          <ErrorBoundary>
            <Route exact path='/' component={Home}/>
            <Route path='/dashboard' component={DashboardInterface}/>
            <Route path='/devices' component={DevicesInterface}/>
            <Route path='/installer' component={PackageInstallerInterface}/>
            <Route path='/packages' component={PackageManagerInterface}/>
            <Route path='/package/:packageName' component={PackageInterface}/>
          </ErrorBoundary>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
