import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import { shortNameCapitalized } from "utils/format";

// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import TableInputs from "components/TableInputs";

function Ports({ ports, isInstalled, hideCardHeaders, updateUserSetPorts }) {
  // If there are no userSet ports, return null
  if (!Object.keys(ports).length) return null;

  return (
    <>
      <SubTitle>Ports</SubTitle>
      <Card>
        {ports.map(({ dnpName, values }) => (
          <div key={dnpName} className="card-subgroup">
            {/* Only display the name of the DNP if there are more than one */}
            {!hideCardHeaders && (
              <div className="section-card-subtitle">
                {shortNameCapitalized(dnpName)}
              </div>
            )}
            <TableInputs
              headers={["Host port", "Package portNumber / protocol"]}
              content={values.map(({ id, ...port }) => [
                {
                  disabled: isInstalled[dnpName],
                  placeholder: "ephemeral port (32768-65535)",
                  value: port.host || "",
                  onValueChange: value =>
                    updateUserSetPorts({ ...port, id, dnpName, host: value })
                },
                {
                  disabled: true,
                  value:
                    port.container + (port.protocol ? "/" + port.protocol : "")
                }
              ])}
            />
          </div>
        ))}
      </Card>
    </>
  );
}

/**
 * @param ports = {
 * "bitcoin.dnp.dappnode.eth": {
 *   "30303:30303/udp": {
 *     host: "30304",
 *     container: "30303",
 *     protocol: "udp",
 *     index: 0,
 *   },
 *   "8333:8333": {
 *     host: "8444",
 *     container: "8333",
 *     index: 1
 *   }
 * }, ... }
 */
Ports.propTypes = {
  ports: PropTypes.arrayOf(
    PropTypes.shape({
      dnpName: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          host: PropTypes.string.isRequired,
          container: PropTypes.string.isRequired,
          protocol: PropTypes.string,
          index: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  isInstalled: PropTypes.object.isRequired,
  hideCardHeaders: PropTypes.bool.isRequired,
  updateUserSetPorts: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  ports: selector.getPortsArray,
  isInstalled: selector.getIsInstalled,
  hideCardHeaders: selector.getHideCardHeaders
});

const mapDispatchToProps = {
  updateUserSetPorts: action.updateUserSetPorts
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Ports);
