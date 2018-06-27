import React from "react";
import "./terminal.css";
import AnsiUp from "ansi_up";
const ansi_up = new AnsiUp();

const terminalID = "terminal";

export default class Log extends React.Component {
  scrollToBottom() {
    const element = document.getElementById(terminalID);
    if (element) element.scrollTop = element.scrollHeight;
  }

  render() {
    let msgAnsi;

    if (this.props.text && this.props.text !== "") {
      msgAnsi = this.props.text;
    } else msgAnsi = "EMPTY";

    let msgHTML = ansi_up.ansi_to_html(msgAnsi);
    return (
      <div>
        <div className="card text-white bg-dark mb-3">
          <div className="card-body terminal" id={terminalID}>
            <div
              className="card-text"
              dangerouslySetInnerHTML={{ __html: msgHTML }}
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary tableAction-button"
          onClick={this.scrollToBottom.bind(this)}
        >
          Scroll to bottom
        </button>
      </div>
    );
  }
}
