import React from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";

const ProgressBarWrapper = ({ progress }) => {
  const progressPercent = Math.floor(100 * progress);
  return (
    <ProgressBar
      now={progressPercent || 100}
      animated={true}
      label={`${progressPercent}%`}
    />
  );
};

class DropdownIcon extends React.Component {
  render() {
    return <div onClick={this.props.onClick}>{this.props.children}</div>;
  }
}

const BaseDropdown = ({
  name,
  messages,
  Icon,
  onClick,
  offset,
  moreVisible
}) => {
  if (!Array.isArray(messages)) {
    console.error("messages must be an array");
    return null;
  }

  let globalType = "light"; // Light is a white circle
  const messageTypes = messages
    .filter(message => !message.viewed)
    .map(message => message.type || "");
  if (messageTypes.includes("danger")) globalType = "danger";
  else if (messageTypes.includes("warning")) globalType = "warning";
  else if (messageTypes.includes("success")) globalType = "success";
  // A message type can be "", ignore it
  const messagesAvailable = Boolean(messageTypes.filter(e => e).length);

  const attentionGrab = moreVisible && messagesAvailable;
  return (
    <Dropdown key={name} drop={"left"}>
      <Dropdown.Toggle as={DropdownIcon}>
        <div
          onClick={onClick}
          className={
            "dropdown-menu-toggle" + (attentionGrab ? " atention-grab" : "")
          }
          data-toggle="tooltip"
          data-placement="bottom"
          title={name}
          data-delay="300"
        >
          <Icon />
          <div className={`dropdown-menu-bubble ${globalType}`} />
        </div>
      </Dropdown.Toggle>

      {/* offset controls the position of the dropdown menu.
        It's purpose is to control clipping on small screens, 
        by placing them as right as possible */}
      <Dropdown.Menu>
        <Dropdown.Header>{name}</Dropdown.Header>
        {messages.map(({ type, title, body, progress }, i) => (
          <Dropdown.Item key={i}>
            {title ? <div className={`title text-${type}`}>{title}</div> : null}
            {body ? <div className="text">{body}</div> : null}
            {progress ? <ProgressBarWrapper progress={progress} /> : null}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

BaseDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  Icon: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  offset: PropTypes.string,
  moreVisible: PropTypes.bool
};

export default BaseDropdown;
