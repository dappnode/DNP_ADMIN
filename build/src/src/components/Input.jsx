import React from "react";
import PropTypes from "prop-types";
import onEnterKey from "utils/onEnterKey";
import "./input.css";

const Input = ({
  onEnterPress = () => {},
  onValueChange,
  lock,
  prepend,
  append,
  className,
  ...props
}) => {
  /**
   * Construct the basic input element
   */
  const input = (
    <input
      type="text"
      className={`form-control ${className}`}
      onChange={e => onValueChange(e.target.value)}
      onKeyPress={onEnterKey(onEnterPress)}
      // Lock props
      readOnly={lock}
      {...props}
    />
  );

  /**
   * Add the `append` and `prepend` components
   */
  let inputWithPreAndAppend;

  if (prepend && append)
    inputWithPreAndAppend = (
      <div className="input-group">
        <div className="input-group-prepend">
          {typeof prepend === "string" ? (
            <span className="input-group-text">{prepend}</span>
          ) : (
            prepend
          )}
        </div>
        {input}
        <div className="input-group-append">
          {typeof append === "string" ? (
            <span className="input-group-text">{append}</span>
          ) : (
            append
          )}
        </div>
      </div>
    );
  else if (prepend)
    inputWithPreAndAppend = (
      <div className="input-group">
        <div className="input-group-prepend">
          {typeof prepend === "string" ? (
            <span className="input-group-text">{prepend}</span>
          ) : (
            prepend
          )}
        </div>
        {input}
      </div>
    );
  else if (append)
    inputWithPreAndAppend = (
      <div className="input-group">
        {input}
        <div className="input-group-append">
          {typeof append === "string" ? (
            <span className="input-group-text">{append}</span>
          ) : (
            append
          )}
        </div>
      </div>
    );
  else inputWithPreAndAppend = input;

  /**
   * Return the final component
   */
  return inputWithPreAndAppend;
};

Input.propTypes = {
  onEnterPress: PropTypes.func,
  onValueChange: PropTypes.func,
  lock: PropTypes.bool,
  prepend: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  append: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  className: PropTypes.string
};

export default Input;
