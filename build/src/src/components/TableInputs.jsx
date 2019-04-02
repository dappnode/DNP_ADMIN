import React from "react";
import Input from "components/Input";
import styled from "styled-components";

function TableInputs({ headers, content }) {
  const TableXN = styled.div`
    display: grid;
    grid-gap: 1em;
    grid-template-columns: auto auto;
  `;
  const Header = styled.h6`
    opacity: 0.5;
    margin-bottom: 0;
  `;

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

export default TableInputs;
