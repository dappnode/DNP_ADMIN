import React from "react";

export default class LogProgress extends React.Component {
  render() {
    // this.progressLog = {msg: {}, order: []
    const progressLog = this.props.progressLog;
    const msgs = progressLog.msg || {};
    const pakagesOrder = progressLog.order || [];
    const items = pakagesOrder.map((name, i) => {
      let msg = msgs[name] || "loading...";
      return <li key={i}>{name + ": " + msg}</li>;
    });
    // alert alert-success
    // alert alert-danger
    if (pakagesOrder.length === 0) {
      return null;
    } else {
      return (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Installation progress</h4>
          <ul>{items}</ul>
        </div>
      );
    }
  }
}
