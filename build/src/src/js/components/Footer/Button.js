import React from "react";


export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {name: 'Will'}
  }

  handleOnClick() {

  }

  render() {
    return (
      <div>
        <button
          id={this.props.btnId}
          class='bttn'
          onClick={this.handleOnClick}
          >{this.props.btnId}
        </button>
      </div>
    );
  }
}
