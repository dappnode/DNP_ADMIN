import React from "react"
import AnsiUp from "ansi_up"
const ansi_up = new AnsiUp;

export default class Log extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // const topics = Object.keys(this.props.log).filter(key => !this.props.log.hasOwnProperty(key));
    const topics = Object.keys(this.props.log) || [];
    let _this = this;
    let logs = topics.map(function(topic, i){
      let type
      let msgAnsi = _this.props.log[topic].msg
      let msgHTML = ansi_up.ansi_to_html(msgAnsi)
      // console.log('###### message',message)
      // message.replace('.', '<br/>')
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
      return (
        <div key={i} class={"alert alert-"+type} role="alert">
          {topic}:
          <div dangerouslySetInnerHTML={{__html: msgHTML}} />
        </div>
      )
    })
    // alert alert-success
    // alert alert-danger
    return logs;
  }
}
