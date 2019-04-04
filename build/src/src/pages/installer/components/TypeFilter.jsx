import React from "react";
import PropTypes from "prop-types";
import Button from "components/Button";

function TypeFilter({ types, onTypeChange }) {
  if (Object.keys(types).length === 0) return null;

  return (
    <div className="type-filter">
      <span>Filter by type:</span>
      {Object.entries(types).map(([type, checked]) => (
        <Button
          key={type}
          onClick={() => onTypeChange(type)}
          variant={checked ? "secondary" : "outline-secondary"}
        >
          {type}
        </Button>
      ))}
    </div>
  );
}

TypeFilter.protoTypes = {
  types: PropTypes.objectOf(PropTypes.string).isRequired,
  onTypeChange: PropTypes.func.isRequired
};

export default TypeFilter;
