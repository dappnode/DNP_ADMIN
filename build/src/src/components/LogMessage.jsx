import React from "react";
import AppStore from "stores/AppStore";

export default class LogMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logMessage: AppStore.getLogMessage()
    };
    this.updateLogMessage = this.updateLogMessage.bind(this);
  }

  componentDidMount() {
    AppStore.on("CHANGE", this.updateLogMessage);
  }
  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateLogMessage);
  }
  updateLogMessage() {
    this.setState({
      logMessage: AppStore.getLogMessage()
    });
  }

  render() {
    if (this.state.logMessage.msg === "") {
      return null;
    } else {
      if (this.state.logMessage.success) {
        return (
          <div className="alert alert-success" role="alert">
            {this.state.logMessage.msg}
          </div>
        );
      } else {
        return (
          <div>
            <div className="alert alert-danger" role="alert">
              {this.state.logMessage.msg}
            </div>
          </div>
        );
      }
    }
  }
}
