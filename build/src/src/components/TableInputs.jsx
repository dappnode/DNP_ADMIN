import React from "react";
import Input from "components/Input";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * Note to self:
 * `styled.*` calls MUST be outside the render function.
 * Otherwise the reference to an element will change every
 * render and react will re-render the entire underlying
 * component. For example, an input will cause it to lose focus
 */
const TableXN = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: auto auto;
`;
const Header = styled.h6`
  opacity: 0.5;
  margin-bottom: 0;
`;

function TableInputs({ headers, content }) {
  if (!Array.isArray(headers)) {
    console.error("headers must be an array");
    return null;
  }
  if (!Array.isArray(content)) {
    console.error("content must be an array");
    return null;
  }
  content.forEach(row => {
    if (!Array.isArray(row)) {
      console.error("row must be an array");
      return null;
    }
  });

  return (
    <TableXN>
      {headers.map((header, i) => (
        <Header key={i}>{header}</Header>
      ))}
      {content.map((row, i) =>
        row.map((col, j) => <Input key={`${i}${j}`} {...col} />)
      )}
    </TableXN>
  );
}

TableInputs.propTypes = {
  headers: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default TableInputs;
