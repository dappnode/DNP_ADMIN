import React from "react";

const DnpName = ({ dnpName }) => {
  // Return no name if undefined
  if (!dnpName) return <span>No name</span>;

  // Split the name by "Vpn" and "dnp.dappnode.eth"
  const [shortName, domain] = dnpName.split(/\.(.+)/);
  if (shortName && domain) {
    return (
      <React.Fragment>
        <span style={{ textTransform: "capitalize" }}>{shortName}</span>
        <span style={{ opacity: 0.3 }}>.{domain}</span>
      </React.Fragment>
    );
  } else {
    return <span>{dnpName}</span>;
  }
};

export default DnpName;
