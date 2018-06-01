import React from "react"
import AnsiUp from "ansi_up"
const ansi_up = new AnsiUp;

export default class Log extends React.Component {
  render() {
    let msgAnsi = this.props.text || ''
    // Do not display this module if there are not logs yet
    if (msgAnsi == '') {
      return(
        <div>
          <p>Click "Load logs" to view the logs of this package</p>
        </div>
      )
    }

    let msgHTML = ansi_up.ansi_to_html(msgAnsi)
    return (
      <div class="card text-white bg-dark mb-3">
        <div class="card-body terminal">
          <div class="card-text" dangerouslySetInnerHTML={{__html: msgHTML}} />
        </div>
      </div>
    )
  }
}
