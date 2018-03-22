import React from "react";
import AppStore from 'Store';

export default class LogMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logMessage: AppStore.getLogMessage()
    }
  }

  componentWillMount() {
    AppStore.on("CHANGE", this.updateLogMessage.bind(this));
  }
  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateLogMessage.bind(this));
  }
  updateLogMessage() {
    this.setState({
      logMessage: AppStore.getLogMessage()
    });
  }

  render() {

    return (
      <div>
        <span>Message log: </span>
        <span><strong>{this.state.logMessage}</strong></span>
      </div>
    );
  }
}
