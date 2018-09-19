import React from "react";
import "./terminal.css";
import AnsiUp from "ansi_up";
const ansi_up = new AnsiUp();

export default class Log extends React.Component {
  render() {
    let msgAnsi;

    if (this.props.text && this.props.text !== "") {
      msgAnsi = this.props.text;
    } else msgAnsi = "loading...";

    let msgHTML = ansi_up.ansi_to_html(msgAnsi);
    return (
      <div className="card text-white bg-dark">
        <div className="card-body terminal" id={this.props.terminalID}>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: msgHTML }}
          />
        </div>
      </div>
    );
  }
}
