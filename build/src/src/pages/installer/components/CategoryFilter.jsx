import React from "react";
import PropTypes from "prop-types";
import Button from "components/Button";

function TypeFilter({ categories, onCategoryChange }) {
  if (Object.keys(categories).length === 0) return null;

  return (
    <div className="type-filter">
      {Object.entries(categories)
        .sort()
        .map(([category, checked]) => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            variant={checked ? "dappnode" : "outline-secondary"}
          >
            {category}
          </Button>
        ))}
    </div>
  );
}

/**
 * @param {object} categories = {
 *   "library": true,
 *   "service": false
 * }
 */
TypeFilter.protoTypes = {
  categories: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default TypeFilter;
