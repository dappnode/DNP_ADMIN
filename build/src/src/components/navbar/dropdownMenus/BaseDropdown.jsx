import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./dropdown.css";

// Utilities

const ProgressBarWrapper = ({ progress }) => {
  const progressPercent = Math.floor(100 * progress);
  return (
    <ProgressBar
      now={progressPercent}
      animated={true}
      label={`${progressPercent}%`}
    />
  );
};

function parseMessagesType(messages) {
  let globalType = "light"; // Light is a white circle
  const messageTypes = messages
    .filter(message => !message.viewed)
    .map(message => message.type || "");
  if (messageTypes.includes("danger")) globalType = "danger";
  else if (messageTypes.includes("warning")) globalType = "warning";
  else if (messageTypes.includes("success")) globalType = "success";
  return globalType;
}

function areMessagesUnread(messages) {
  const unreadMessages = messages.filter(message => message && !message.viewed);
  return Boolean(unreadMessages.length);
}

function BaseDropdown({
  name,
  messages,
  Icon,
  onClick,
  className,
  placeholder,
  moreVisible
}) {
  const [collapsed, setCollapsed] = useState(true);
  const dropdownEl = useRef(null);

  function onToggle(e) {
    setCollapsed(!collapsed);
    if (typeof onClick === "function") onClick(e);
  }

  useEffect(() => {
    /**
     * As recommended in https://github.com/airbnb/react-outside-click-handler/blob/master/src/OutsideClickHandler.jsx
     * it is better to listen to mousedown, then subscribe to mouseup,
     * and then collpase the menu. This also helps with the case of
     * using the toggle to close the menu. This is why the ref is in
     * the general dropdown div, not in the dropdown menu.
     */
    if (collapsed) return; // Prevent unnecessary listeners
    function handleMouseUp(e) {
      document.removeEventListener("mouseup", handleMouseUp);
      if (!dropdownEl.current.contains(e.target)) setCollapsed(true);
    }
    function handleMouseDown(e) {
      if (!dropdownEl.current.contains(e.target))
        document.addEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [collapsed]);

  if (!Array.isArray(messages)) {
    console.error("messages must be an array");
    return null;
  }

  // A message type can be "", ignore it
  const globalType = parseMessagesType(messages);
  const messagesAvailable = areMessagesUnread(messages);

  const attentionGrab = moreVisible && messagesAvailable;
  return (
    <div ref={dropdownEl} className={`tn-dropdown ${className}`}>
      <div
        onClick={onToggle}
        className={
          "tn-dropdown-toggle" + (attentionGrab ? " atention-grab" : "")
        }
        data-toggle="tooltip"
        data-placement="bottom"
        title={name}
        data-delay="300"
      >
        <Icon />
        <div className={`icon-bubble ${globalType}`} />
      </div>

      {/* offset controls the position of the dropdown menu.
        It's purpose is to control clipping on small screens, 
        by placing them as right as possible */}
      <div className={`menu ${collapsed ? "" : "show"}`}>
        <div className="header">{name}</div>
        {messages.map(({ type, title, body, progress, showProgress }, i) => (
          <div key={i}>
            {title ? <div className={`title text-${type}`}>{title}</div> : null}
            {body ? <div className="text">{body}</div> : null}
            {showProgress ? <ProgressBarWrapper progress={progress} /> : null}
          </div>
        ))}
        {!messages.length && placeholder && (
          <div className="placeholder">{placeholder}</div>
        )}
      </div>
    </div>
  );
}

BaseDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  Icon: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  offset: PropTypes.string,
  moreVisible: PropTypes.bool
};

export default BaseDropdown;
