import React from "react";
// Icons
import Circle from "Icons/Circle";

class DropdownIcon extends React.Component {
  render() {
    return (
      <span
        className="nav-link dropdown-toggle mr-lg-2"
        id={this.props.name + "Dropdown"}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
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

export default class NavbarTopDropdownMessages extends React.Component {
  render() {
    let globalType = "success";
    let messageTypes = this.props.messages.map(message => message.type || "");
    if (messageTypes.includes("danger")) globalType = "danger";
    else if (messageTypes.includes("warning")) globalType = "warning";

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
          </a>
        </div>
      );
    });
    return (
      <li className="nav-item dropdown">
        <DropdownIcon
          type={globalType}
          name={this.props.name}
          icon={this.props.icon}
        />
        <div className="dropdown-menu" aria-labelledby="messagesDropdown">
          <h6 className="dropdown-header">{this.props.name}:</h6>
          {listItems}
        </div>
      </li>
    );
  }
}
