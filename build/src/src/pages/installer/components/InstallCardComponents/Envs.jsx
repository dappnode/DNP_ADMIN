import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import TableInput from "components/table/TableInput";
import capitalize from "utils/capitalize";

/**
 * Will receive an object with this structure, envs = {
 *   dnp-a.dnp.dappnode.eth: {
 *     "ENV_NAME1": "1"
 *   },
 *   dnp-b.dnp.dappnode.eth: {
 *     "ENV_NAME2": "2"
 *   }
 * }
 */

class Envs extends React.Component {
  render() {
    const { envs } = this.props;

    // Prevent errors, filter keys that do not contain objects
    const _envs = {};
    for (const key of Object.keys(envs)) {
      if (typeof envs[key] === "object" && Object.keys(envs[key]).length) {
        _envs[key] = envs[key];
      }
    }

    // If no envs, return null
    if (!Object.keys(_envs).length) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Enviroment variables</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {Object.keys(_envs).map(dnpName => (
              <div key={dnpName} className="card-subgroup">
                {/* Only display the name of the DNP if there are more than one */}
                {this.props.hideCardHeaders ? null : (
                  <div className="section-card-subtitle">
                    {capitalize(dnpName)}
                  </div>
                )}
                {/* HEADER */}
                <div className="row" style={{ opacity: 0.5 }}>
                  <div className="col" style={{ paddingRight: "7.5px" }}>
                    <h6>Name</h6>
                  </div>
                  <div className="col" style={{ paddingLeft: "7.5px" }}>
                    <h6>Value</h6>
                  </div>
                </div>

                {/* PSEUDO-TABLE */}
                {Object.keys(_envs[dnpName]).map(envName => (
                  <div className="row" key={envName}>
                    <div className="col" style={{ paddingRight: "7.5px" }}>
                      <TableInput lock={true} value={envName} />
                    </div>

                    <div className="col" style={{ paddingLeft: "7.5px" }}>
                      <TableInput
                        placeholder={"enter value..."}
                        value={_envs[dnpName][envName]}
                        onChange={e => {
                          this.props.updateUserSetEnvs({
                            value: e.target.value,
                            key: envName,
                            dnpName
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  envs: selector.getEnvs,
  hideCardHeaders: selector.getHideCardHeaders
});

const mapDispatchToProps = {
  updateUserSetEnvs: action.updateUserSetEnvs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Envs);
