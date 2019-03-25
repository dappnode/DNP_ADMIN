import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as action from "../../actions";
import * as selector from "../../selectors";
import TableInput from "components/table/TableInput";
import capitalize from "utils/capitalize";

class Ports extends React.Component {
  render() {
    const { ports } = this.props;

    // Prevent errors, filter keys that do not contain objects
    const _ports = {};
    for (const key of Object.keys(ports)) {
      if (typeof ports[key] === "object" && Object.keys(ports[key]).length) {
        _ports[key] = ports[key];
      }
    }

    // If no ports, return null
    if (!Object.keys(_ports).length) {
      return null;
    }

    // ports =
    // "bitcoin.dnp.dappnode.eth": {
    //   "30303:30303/udp": {
    //     host: "30304",
    //     container: "30303",
    //     type: "udp"
    //   },
    //   "8333:8333": {
    //     host: "8444"
    //     container: "8333"
    //   }
    // }

    return (
      <React.Fragment>
        <div className="section-subtitle">Ports</div>
        <div className="card mb-4">
          <div className="card-body" style={{ paddingBottom: "0.25rem" }}>
            {Object.keys(_ports).map(dnpName => (
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
                    <h6>Host port</h6>
                  </div>
                  <div className="col" style={{ paddingLeft: "7.5px" }}>
                    <h6>Package port / type</h6>
                  </div>
                </div>

                {/* PSEUDO-TABLE */}
                {Object.keys(_ports[dnpName]).map(id => (
                  <div className="row" key={id}>
                    <div className="col" style={{ paddingRight: "7.5px" }}>
                      <TableInput
                        lock={this.props.isInstalled[dnpName]}
                        placeholder={"ephemeral port (32768-65535)"}
                        value={_ports[dnpName][id].host || ""}
                        onChange={e => {
                          this.props.updateUserSetPorts({
                            ..._ports[dnpName][id],
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
                        value={`${_ports[dnpName][id].container}${
                          _ports[dnpName][id].type
                            ? `/${_ports[dnpName][id].type}`
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
  ports: selector.getPorts,
  isInstalled: selector.getIsInstalled,
  hideCardHeaders: selector.getHideCardHeaders
});

const mapDispatchToProps = {
  updateUserSetPorts: action.updateUserSetPorts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ports);
