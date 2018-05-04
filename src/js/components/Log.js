import React from "react"

export default class Log extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // const topics = Object.keys(this.props.log).filter(key => !this.props.log.hasOwnProperty(key));
    const topics = Object.keys(this.props.log) || [];
    let _this = this;
    let logs = topics.map(function(topic, i){
      let type;
      switch(_this.props.log[topic].type) {
          case 'success':
              type = 'success';
              break;
          case 'error':
              type = 'danger';
              break;
          default:
              type = 'primary';
      }
      return <div key={i} class={"alert alert-"+type} role="alert">{topic}: {_this.props.log[topic].msg}</div>;
    })
    // alert alert-success
    // alert alert-danger
    return logs;
  }
}
