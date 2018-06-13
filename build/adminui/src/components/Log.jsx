import React from "react";

export default class Log extends React.Component {
  render() {
    // const topics = Object.keys(this.props.log).filter(key => !this.props.log.hasOwnProperty(key));

    const topics = Object.keys(this.props.log) || [];
    // console.log('LOG TOPICS',topics,'logs',this.props.log)
    let _this = this;
    let logs = topics.map(function(topic, i) {
      let type;
      let msg = _this.props.log[topic].msg;
      // console.log('###### message',message)
      // message.replace('.', '<br/>')
      switch (_this.props.log[topic].type) {
        case "success":
          type = "success";
          break;
        case "error":
          type = "danger";
          break;
        default:
          type = "warning";
      }
      return (
        <div key={i} className={"alert alert-" + type} role="alert">
          <h4 className="alert-heading">{topic}</h4>
          <p>{msg}</p>
        </div>
      );
    });
    // alert alert-success
    // alert alert-danger
    return logs;
  }
}
