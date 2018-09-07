import React from "react";
// Components
// Logic

export default class ProgressLog extends React.Component {
  render() {
    const progressLog = this.props.progressLog;
    return (
      <React.Fragment>
        <h4 className="card-title">Installing...</h4>
        <ul>
          {Object.keys(progressLog.msg || {}).map((item, i) => (
            <li key={i}>{item + ": " + progressLog.msg[item]}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}
