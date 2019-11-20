import React from "react";
import onEnterKey from "utils/onEnterKey";
import "./input.css";

interface InputProps {
  onEnterPress: () => void;
  onValueChange: (value: string) => void;
  value: string;
  lock?: boolean;
  prepend?: string | React.ReactElement;
  append?: string | React.ReactElement;
  className?: string;
}

const Input: React.FunctionComponent<
  InputProps & React.HTMLAttributes<HTMLInputElement>
> = ({
  onEnterPress,
  onValueChange,
  value,
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
      value={value}
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

export default Input;
