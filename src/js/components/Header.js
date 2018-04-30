import React from "react";
import Title from './Header/Title';
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      title: "Private UI",
    };
  }

  render() {
    return (
      <div class='header'>
        <nav>
          <Link to="dev">DEVICES</Link>
          <Link to="pkg">PACKAGES</Link>
        </nav>
        <Title title={this.state.title} />
      </div>
    );
  }
}
