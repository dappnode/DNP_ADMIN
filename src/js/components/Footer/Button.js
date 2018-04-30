import React from "react";
import EventBus from 'EventBusAlias';

export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {name: 'Will'}
  }

  handleOnClick() {
    
    EventBus.emit(EventBus.tag.dog,
      {
        msg:'Bark, bark!'
      }
    )
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
