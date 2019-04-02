import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import { capitalize } from "utils/strings";
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
        {Object.entries(ports).map(([dnpName, dnpVols]) => (
          <div key={dnpName} className="card-subgroup">
            {/* Only display the name of the DNP if there are more than one */}
            {!hideCardHeaders && (
              <div className="section-card-subtitle">{capitalize(dnpName)}</div>
            )}
            <TableInputs
              headers={["Host port", "Package port / type"]}
              content={Object.entries(dnpVols).map(([id, port]) => [
                {
                  lock: isInstalled[dnpName],
                  placeholder: "ephemeral port (32768-65535)",
                  value: port.host || "",
                  onValueChange: value =>
                    updateUserSetPorts({ ...port, id, dnpName, host: value })
                },
                {
                  lock: true,
                  value: port.container + (port.type ? "/" + port.type : "")
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
 *     type: "udp"
 *   },
 *   "8333:8333": {
 *     host: "8444"
 *     container: "8333"
 *   }
 * }, ... }
 */

const mapStateToProps = createStructuredSelector({
  ports: selector.getPorts,
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
