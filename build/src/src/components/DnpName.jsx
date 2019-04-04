import React from "react";
import styled from "styled-components";

const Domain = styled.span`
  opacity: 0.3;
`;
const Name = styled.span`
  text-transform: capitalize;
`;

const DnpName = ({ dnpName }) => {
  // Return no name if undefined
  if (!dnpName) return <span>No name</span>;

  // Split the name by "Vpn" and "dnp.dappnode.eth"
  const [shortName, domain] = dnpName.split(/\.(.+)/);
  if (shortName && domain) {
    return (
      <span>
        <Name>{shortName}</Name>
        <Domain>.{domain}</Domain>
      </span>
    );
  } else {
    return <span>{dnpName}</span>;
  }
};

export default DnpName;
