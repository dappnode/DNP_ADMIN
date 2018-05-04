import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import SidebarWrapper from './components/SidebarWrapper'

import '../css/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function Layout(props) {
  return (
    <HashRouter>
      <div>
        <SidebarWrapper />
      </div>
    </HashRouter>
  )
}

render(<Layout />, document.getElementById('root'));
