import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import TableInput from "components/table/TableInput";
import { capitalize } from "utils/strings";

class Vols extends React.Component {
  render() {
    const { vols } = this.props;

    // Prevent errors, filter keys that do not contain objects
    const _vols = {};
    for (const key of Object.keys(vols)) {
      if (typeof vols[key] === "object" && Object.keys(vols[key]).length) {
        _vols[key] = vols[key];
      }
    }

    // If no vols, return null
    if (!Object.keys(_vols).length) {
      return null;
    }

    // vols =
    // "bitcoin.dnp.dappnode.eth": {
    //   "/usr/src/config:/data/.chain/config:ro": {
    //     host: "/usr/src/config",
    //     container: "/data/.chain/config",
    //     accessMode: "ro"
    //   },
    //   "bitcoin_data:/data/.chain/var": {
    //     container: "/data/.chain/var",
    //     host: "bitcoin_data"
    //   }
    // }

    return (
      <React.Fragment>
        <div className="section-subtitle">Volumes</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {Object.keys(_vols).map(dnpName => (
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
                    <h6>Host path</h6>
                  </div>
                  <div className="col" style={{ paddingLeft: "7.5px" }}>
                    <h6>Container path (:ro)</h6>
                  </div>
                </div>

                {/* PSEUDO-TABLE */}
                {Object.keys(_vols[dnpName]).map(id => (
                  <div className="row" key={id}>
                    <div className="col" style={{ paddingRight: "7.5px" }}>
                      <TableInput
                        lock={this.props.isInstalled[dnpName]}
                        placeholder={"enter volume path..."}
                        value={_vols[dnpName][id].host || ""}
                        onChange={e => {
                          this.props.updateUserSetVols({
                            ..._vols[dnpName][id],
                            host: e.target.value,
                            id,
                            dnpName
                          });
                        }}
                      />
                    </div>

                    <div className="col" style={{ paddingLeft: "7.5px" }}>
                      <TableInput
                        lock={true}
                        value={`${_vols[dnpName][id].container}${
                          _vols[dnpName][id].accessMode
                            ? `:${_vols[dnpName][id].accessMode}`
                            : ""
                        }`}
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
