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

function Vols({ vols, isInstalled, updateUserSetVols, hideCardHeaders }) {
  // If there are no userSet vols, don't render
  if (!Object.keys(vols).length) return null;

  return (
    <>
      <SubTitle>Volumes</SubTitle>
      <Card>
        {Object.entries(vols).map(([dnpName, dnpVols]) => (
          <div key={dnpName} className="card-subgroup">
            {/* Only display the name of the DNP if there are more than one */}
            {!hideCardHeaders && (
              <div className="section-card-subtitle">{capitalize(dnpName)}</div>
            )}
            <TableInputs
              headers={["Host path", "Container path (:ro)"]}
              content={Object.entries(dnpVols).map(([id, vol]) => [
                {
                  lock: isInstalled[dnpName],
                  placeholder: "enter volume path...",
                  value: vol.host || "",
                  onValueChange: value =>
                    updateUserSetVols({ ...vol, id, dnpName, host: value })
                },
                {
                  lock: true,
                  value:
                    vol.container + (vol.accessMode ? ":" + vol.accessMode : "")
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
 * @param vols = {
 *   "bitcoin.dnp.dappnode.eth": {
 *     "/usr/src/config:/data/.chain/config:ro": {
 *       host: "/usr/src/config",
 *       container: "/data/.chain/config",
 *       accessMode: "ro"
 *     },
 *     "bitcoin_data:/data/.chain/var": {
 *       container: "/data/.chain/var",
 *       host: "bitcoin_data"
 *     }
 *   }, ... }
 */

const mapStateToProps = createStructuredSelector({
  vols: selector.getVols,
  isInstalled: selector.getIsInstalled,
  hideCardHeaders: selector.getHideCardHeaders
});

const mapDispatchToProps = {
  updateUserSetVols: action.updateUserSetVols
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Vols);
