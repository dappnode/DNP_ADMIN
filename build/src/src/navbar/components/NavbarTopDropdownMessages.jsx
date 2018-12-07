import React from "react";
// Icons
import Circle from "Icons/Circle";

class DropdownIcon extends React.Component {
  render() {
    return (
      <span
        className="nav-link dropdown-toggle"
        id={this.props.name + "Dropdown"}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{ paddingRight: 0, paddingLeft: 0 }}
        id={this.props.id}
      >
        <this.props.icon />
        <span className="d-lg-none">
          {this.props.name}
          <span className={"badge badge-pill badge-" + this.props.type}>·</span>
        </span>
        <span className={"indicator d-none d-lg-block text-" + this.props.type}>
          <Circle scale={1.3} />
        </span>
      </span>
    );
  }
}

/**
 * Expects a prop messages =
 * [
 *   {
 *     type: "danger" / "warning" / "sucess" / "default",
 *     rightText: "text",
 *     title: "text",
 *     body: "body"
 *   }
 * ]
 */

function progressBar(percent) {
  return <div className="determinate" style={{ width: percent + "%" }} />;
}
export default class NavbarTopDropdownMessages extends React.Component {
  componentDidMount() {
    if (this.props.onClick)
      document
        .getElementById("notification-button-" + this.props.name)
        .addEventListener("click", this.props.onClick.bind(this));
  }

  render() {
    if (!Array.isArray(this.props.messages)) {
      console.error(
        "Mandatory prop messages must be an array in component NavbarTopDropdownMessages: ",
        this.props.messages
      );
      return null;
    }

    // Compute the color of the circle next to the icon
    let globalType = "light"; // Light is a white circle
    let messageTypes = this.props.messages
      .filter(message => !message.viewed)
      .map(message => message.type || "");
    if (messageTypes.includes("danger")) globalType = "danger";
    else if (messageTypes.includes("warning")) globalType = "warning";
    else if (messageTypes.includes("success")) globalType = "success";

    let listItems = this.props.messages.map((message, i) => {
      let type = message.type || "default";
      let rightText = message.rightText || "";
      return (
        <div key={i}>
          <div className="dropdown-divider" />
          <a className="dropdown-item">
            <span className={"text-" + type}>
              <strong>{message.title}</strong>
            </span>
            <span className="small float-right text-muted">{rightText}</span>
            <div className="dropdown-message small">{message.body}</div>

            {message.progress ? (
              <div className="dropdown-message small">
                <div
                  className="progress"
                  style={{
                    opacity: 0.4,
                    position: "relative",
                    bottom: "-4px",
                    margin: 0
                  }}
                >
                  {progressBar(Math.round(100 * message.progress))}
                </div>
                <div
                  className="text-center"
                  style={{
                    position: "relative",
                    bottom: "14px"
                  }}
                >
                  {`${Math.round(100 * message.progress)} %`}
                </div>
              </div>
            ) : null}
          </a>
        </div>
      );
    });
    return (
      <li
        className="nav-item dropdown"
        style={{
          position: "relative",
          left: "12px",
          margin: "0 5px"
        }}
      >
        <DropdownIcon
          type={globalType}
          name={this.props.name}
          icon={this.props.icon}
          id={"notification-button-" + this.props.name}
        />
        <div
          className="dropdown-menu dropdown-menu-right scrollable-menu"
          aria-labelledby="messagesDropdown"
        >
          <h6 className="dropdown-header">{this.props.name}:</h6>
          {listItems}
        </div>
      </li>
    );
  }
}
