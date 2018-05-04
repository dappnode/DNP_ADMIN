import React from 'react'
import MaterialTitlePanel from './material_title_panel'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import params from 'Params';

let styles = {
  sidebar: {
    width: 200,
    height: '100%',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: params.color.grey,
    textDecoration: 'none',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: params.color.grey,
  },
  content: {
    padding: '16px',
    height: '100%',
    backgroundColor: params.color.background,
  },
};

let SidebarContent = (props) => {
  let style = props.style ? {...styles.sidebar, ...props.style} : styles.sidebar;

  let links = [];
  let labels = {
    deviceManager: 'Device Manager',
    pakageInstaller: 'Package Installer',
    pakageManager: 'Package Manager',
    status: 'DAppNode Status'
  }

  for (let link in labels) {
    links.push(
      // <a key={link} href={link} style={styles.sidebarLink}>{labels[link]}</a>
      <Link key={link} to={link} style={styles.sidebarLink}>{labels[link]}</Link>
    );
  }

  return (
    <MaterialTitlePanel title="Menu" style={style}>
      <div style={styles.content}>
        <Link key={'home'} to='/' style={styles.sidebarLink}>Home</Link>
        <div style={styles.divider} />
        {links}
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: PropTypes.object,
};

export default SidebarContent;
