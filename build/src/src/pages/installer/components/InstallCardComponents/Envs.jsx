import React from "react";
import PropTypes from "prop-types";
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

function sortedEntries(obj) {
  return Object.entries(obj).sort((obj1, obj2) => {
    const idx = 1;
    return obj1[idx] < obj2[idx] ? -1 : obj1[idx] > obj2[idx] ? 1 : 0;
  });
}

function Envs({ envs, hideCardHeaders, updateUserSetEnvs }) {
  // If no envs, return null
  if (!Object.keys(envs || {}).length) return null;

  return (
    <>
      <SubTitle>Enviroment variables</SubTitle>
      <Card>
        {sortedEntries(envs).map(([dnpName, dnpEnvs]) => (
          <div key={dnpName} className="card-subgroup">
            {/* Only display the name of the DNP if there are more than one */}
            {!hideCardHeaders && (
              <div className="section-card-subtitle">{capitalize(dnpName)}</div>
            )}
            <TableInputs
              headers={["Name", "Value"]}
              content={sortedEntries(dnpEnvs).map(([envName, envValue]) => [
                {
                  key: envName + "left",
                  disabled: true,
                  value: envName
                },
                {
                  key: envName + "right",
                  placeholder: "empty",
                  value: envValue || "",
                  onValueChange: value =>
                    updateUserSetEnvs({ value: value, key: envName, dnpName })
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
 * @param envs = {
 *   dnp-a.dnp.dappnode.eth: {
 *     "ENV_NAME1": "1"
 *   },
 *   dnp-b.dnp.dappnode.eth: {
 *     "ENV_NAME2": "2"
 *   }
 * }
 */

Envs.propTypes = {
  envs: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  hideCardHeaders: PropTypes.bool.isRequired,
  updateUserSetEnvs: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  envs: selector.getEnvs,
  hideCardHeaders: selector.getHideCardHeaders
});

const mapDispatchToProps = {
  updateUserSetEnvs: action.updateUserSetEnvs
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Envs);
