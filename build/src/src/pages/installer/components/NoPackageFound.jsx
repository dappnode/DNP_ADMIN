import React from "react";
import newTabProps from "utils/newTabProps";

const PACKAGE_SURVEY_LINK = "https://goo.gl/forms/EjVTHu6UBWBk60Z62";

function NoPackageFound({ query }) {
  return (
    <div className="centered-container">
      <h4>Not found</h4>
      <p>
        If you would like a specific DAppNode package (DNP) to be developed,
        express so in the survery below
      </p>
      <a href={PACKAGE_SURVEY_LINK} {...newTabProps}>
        Request {query}
      </a>
    </div>
  );
}

export default NoPackageFound;
