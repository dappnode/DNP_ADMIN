import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import makeBlockie from "ethereum-blockies-base64";
import { getDappnodeIdentityClean } from "services/dappnodeStatus/selectors";

const DappnodeIdentity = ({ dappnodeIdentity = {} }) => {
  if (typeof dappnodeIdentity !== "object") {
    console.error("dappnodeIdentity must be an object");
    return null;
  }

  // Show a 24x24px blockie icon from the DAppNode's domain or ip+name
  const { name = "", ip = "", domain = "" } = dappnodeIdentity;
  const seed =
    domain && domain.includes(".") ? domain.split(".")[0] : `${name}${ip}`;

  const Icon = () => (
    <React.Fragment>
      <span className="dappnode-name svg-text mr-2">{name}</span>
      {seed ? (
        <img src={makeBlockie(seed)} className="blockies-icon" alt="icon" />
      ) : (
        "?"
      )}
    </React.Fragment>
  );

  return (
    <BaseDropdown
      name="DAppNode Identity"
      messages={Object.values(dappnodeIdentity).map(value => ({
        title: value
      }))}
      Icon={Icon}
      // Right position of the dropdown to prevent clipping on small screens
      offset={"-157px"}
    />
  );
};

DappnodeIdentity.propTypes = {
  dappnodeIdentity: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  dappnodeIdentity: getDappnodeIdentityClean
});

export default connect(
  mapStateToProps,
  null
)(DappnodeIdentity);
