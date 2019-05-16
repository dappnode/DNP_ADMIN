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

  /**
   * Using css Grid all elements are at the same level.
   * This is why the content is flatten with `content.flat()`
   * To ensure that their order is correct a key must exist,
   * which also enforces order. An example of row array = [
   *   { key: id + "left" },
   *   { key: id + "right" }
   * ]
   * Since "left" > "right", this naming ensures that the first
   * element is placed on the left and the other on the right
   */

  return (
    <TableXN>
      {headers.map(header => (
        <Header key={header}>{header}</Header>
      ))}
      {content
        .flat()
        .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
        .map(({ key, ...props }) => (
          <Input key={key} {...props} />
        ))}
    </TableXN>
  );
}

TableInputs.propTypes = {
  headers: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default TableInputs;
