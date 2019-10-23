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

function Envs({ envs, hideCardHeaders, updateUserSetEnvs }) {
  // If no envs, return null
  if (!Object.keys(envs || {}).length) return null;

  return (
    <>
      <SubTitle>Enviroment variables</SubTitle>
      <Card>
        {envs.map(({ dnpName, values }) => (
          <div key={dnpName} className="card-subgroup">
            {/* Only display the name of the DNP if there are more than one */}
            {!hideCardHeaders && (
              <div className="section-card-subtitle">
                {shortNameCapitalized(dnpName)}
              </div>
            )}
            <TableInputs
              headers={["Name", "Value"]}
              content={values.map(({ id, ...env }) => [
                {
                  disabled: true,
                  value: env.name
                },
                {
                  placeholder: "enter value...",
                  value: env.value || "",
                  onValueChange: value =>
                    updateUserSetEnvs({ ...env, id, value: value, dnpName })
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
 *     "ENV_NAME1": {
 *       name: "ENV_NAME1",
 *       value: "1",
 *       index: 0
 *     }
 *   },
 *   dnp-b.dnp.dappnode.eth: {
 *     "ENV_NAME2": {
 *       name: "ENV_NAME2",
 *       value: "2",
 *       index: 1
 *     }
 *   }
 * }
 */

Envs.propTypes = {
  envs: PropTypes.arrayOf(
    PropTypes.shape({
      dnpName: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.string,
          index: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  hideCardHeaders: PropTypes.bool.isRequired,
  updateUserSetEnvs: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  envs: selector.getEnvsArray,
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
