import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './components/App'

import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/main.scss';
import '../css/sb-admin.css';
import '../css/admin_UI.css';

import './vendor/jquery.min.js'
import './vendor/bootstrap.bundle.min.js'
import './vendor/jquery.easing.min.js'

// APIs
import './components/API/chainStatus'

function Layout(props) {
  return (
    <Router>
      <div>
        <App />
      </div>
    </Router>
  )
}

render(<Layout />, document.getElementById('root'));
