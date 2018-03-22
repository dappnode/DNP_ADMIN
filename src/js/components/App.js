import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import DevicesInterface from './DevicesInterface'
import PackageInterface from './PackageInterface'
import Home from './Home'
import Header from './Header'
import Footer from './Footer'

export default function App(props) {
  return (
    <div>
      <Route exact path='/' component={Home}/>
      <Route exact path='/dev' component={DevicesInterface}/>
      <Route exact path='/pkg' component={PackageInterface}/>
      <Footer />
    </div>
  )
}
