import React from 'react';

import Sidebar from 'react-sidebar';
import MaterialTitlePanel from './Sidebar/material_title_panel';
import SidebarContent from './Sidebar/sidebar_content';

import App from './App';

let styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    padding: '0px',
  },
};

let mql = window.matchMedia(`(min-width: 800px)`);

export default class SidebarWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mql: mql,
      docked: false,
      open: false,
    };
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);

    this.onSetOpen = this.onSetOpen.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
  }

  componentDidMount() {
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  onSetOpen(open) {
    this.setState({open: open});
  }

  menuButtonClick(ev) {
    ev.preventDefault();
    this.onSetOpen(!this.state.open);
  }

  mediaQueryChanged() {
    this.setState({
      mql: mql,
      docked: this.state.mql.matches,
    });
  }

  toggleOpen(ev) {
    this.setState({open: !this.state.open});

    if (ev) {
      ev.preventDefault();
    }
  }


  render() {
    let sidebar = <SidebarContent />;

    let contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.menuButtonClick} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> DAppNode</span>
      </span>);

    let sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      sidebarClassName: 'custom-sidebar-class',
      open: this.state.open,
      touch: this.state.touch,
      shadow: this.state.shadow,
      pullRight: this.state.pullRight,
      touchHandleWidth: this.state.touchHandleWidth,
      dragToggleDistance: this.state.dragToggleDistance,
      transitions: this.state.transitions,
      onSetOpen: this.onSetOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.content}>
            <App />
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}
