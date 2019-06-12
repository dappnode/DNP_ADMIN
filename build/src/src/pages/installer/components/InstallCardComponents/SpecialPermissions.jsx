import React from "react";
import ReactMarkdown from "react-markdown";
// Components
import CardList from "components/CardList";
import SubTitle from "components/SubTitle";
// Parsers
import parseSpecialPermissions from "../../parsers/parseSpecialPermissions";

const SpecialPermissions = ({ dnp }) => {
  /**
   * @param specialPermissions = [{
   *   name: "Short description",
   *   details: "Long description of the capabilitites"
   * }, ... ]
   */
  const specialPermissions = parseSpecialPermissions(dnp.manifest);
  if (!specialPermissions.length) return null;
  // "Requires no special permissions"
  return (
    <>
      <SubTitle>Special Permissions</SubTitle>
      <CardList>
        {specialPermissions.map(permission => (
          <div key={permission.name}>
            <strong>{permission.name}</strong>
            <div className="no-p-style" style={{ opacity: 0.6 }}>
              <ReactMarkdown source={permission.details} />
            </div>
          </div>
        ))}
      </CardList>
    </>
  );
};

export default SpecialPermissions;
