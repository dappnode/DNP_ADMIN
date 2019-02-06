import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import TableInput from "components/TableInput";
import capitalize from "utils/capitalize";

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
                {Object.keys(_vols[dnpName]).map(containerAndAccessmode => (
                  <div className="row" key={containerAndAccessmode}>
                    <div className="col" style={{ paddingRight: "7.5px" }}>
                      <TableInput
                        lock={this.props.isInstalled[dnpName]}
                        placeholder={"enter volume path..."}
                        value={_vols[dnpName][containerAndAccessmode] || ""}
                        onChange={e => {
                          // newVol: `${e.target.value}:${containerPath}`,
                          this.props.updateUserSetVols({
                            value: e.target.value,
                            key: containerAndAccessmode,
                            dnpName
                          });
                        }}
                      />
                    </div>

                    <div className="col" style={{ paddingLeft: "7.5px" }}>
                      <TableInput lock={true} value={containerAndAccessmode} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vols);
