import React from "react";
import Input from "components/Input";
import Select from "components/Select";
import Button from "components/Button";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";

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
`;
const Header = styled.h6`
  opacity: 0.5;
  margin-bottom: 0;
`;

function TableInputs({ headers, content, numOfRows = 2, rowsTemplate }) {
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
    <TableXN
      style={{ gridTemplateColumns: rowsTemplate || "auto ".repeat(numOfRows) }}
    >
      {headers.map((header, i) => (
        <Header key={i}>{header}</Header>
      ))}
      {content.map((row, i) =>
        row.map((col, j) =>
          col.empty ? (
            <div key={`${i}${j}`} />
          ) : col.deleteButton ? (
            <Button
              key={`${i}${j}`}
              onClick={col.onClick}
              style={{
                display: "flex",
                fontSize: "1.5rem",
                padding: ".375rem",
                borderColor: "#ced4da"
              }}
            >
              <MdClose />
            </Button>
          ) : col.select ? (
            <Select key={`${i}${j}`} {...col} />
          ) : (
            <Input key={`${i}${j}`} {...col} />
          )
        )
      )}
    </TableXN>
  );
}

TableInputs.propTypes = {
  headers: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default TableInputs;
