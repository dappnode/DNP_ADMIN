import React from "react";
import newTabProps from "utils/newTabProps";
import styled from "styled-components";

const PACKAGE_SURVEY_LINK = "https://goo.gl/forms/EjVTHu6UBWBk60Z62";

const Container = styled.div`
  display: grid;
  place-items: center;
  grid-gap: var(--default-spacing);
  text-align: center;
  opacity: 0.5;
`;

function NoPackageFound({ query }) {
  return (
    <Container>
      <h4>Not found</h4>
      <p>
        If you would like a specific DAppNode package (DNP) to be developed,
        express so in the survery below
      </p>
      <a href={PACKAGE_SURVEY_LINK} {...newTabProps}>
        Request {query}
      </a>
    </Container>
  );
}

export default NoPackageFound;
