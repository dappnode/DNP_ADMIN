import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import SidebarWrapper from './components/SidebarWrapper'

import '../css/main.scss';

function Layout(props) {
  return (
    <BrowserRouter>
      <div>
        <SidebarWrapper />
      </div>
    </BrowserRouter>
  )
}

render(<Layout />, document.getElementById('root'));
