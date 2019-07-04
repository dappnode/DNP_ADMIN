import React from "react";
import PropTypes from "prop-types";

function DataList({ title, data }) {
  if (!data.length) return null;
  return (
    <div>
      <strong>{title}: </strong>
      <ul>
        {data.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

DataList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  ).isRequired
};

export default DataList;
