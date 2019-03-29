import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import makeBlockie from "ethereum-blockies-base64";
import { getDappnodeIdentityClean } from "services/dappnodeStatus/selectors";

const DappnodeIdentity = ({ dappnodeIdentity }) => {
  // Show a 24x24px blockie icon from the DAppNode's domain or ip+name
  let seed;
  if (dappnodeIdentity.domain) seed = dappnodeIdentity.domain.split(".")[0];
  else seed = (dappnodeIdentity.name || "") + (dappnodeIdentity.ip || "");

  const Icon = () => (
    <React.Fragment>
      <span className="dappnode-name svg-text mr-2">
        {dappnodeIdentity.name}
      </span>
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
      messages={Object.keys(dappnodeIdentity).map(key => ({
        title: dappnodeIdentity[key]
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
