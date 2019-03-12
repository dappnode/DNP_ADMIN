import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as a from "../actions";
import * as s from "../selectors";
import { connect } from "react-redux";
import DnpName from "components/DnpName";
import TextWithUrls from "components/TextWithUrls";
import computeSemverUpdateType from "utils/computeSemverUpdateType";

const bottomLine = {
  borderBottom: "1px solid #dfdfdf",
  paddingBottom: "12px",
  marginBottom: "12px"
};
const margin = "5px";
const padding = "0.7rem";

function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

const SystemUpdateDetails = ({ coreDeps, coreManifest, updateCore }) => {
  if (!coreDeps.length) return null;
  const coreChangelog = (coreManifest || {}).changelog;
  const coreInstallWarning = ((coreManifest || {}).warnings || {}).onInstall;
  return (
    <React.Fragment>
      <div className="card mb-3">
        <div className="card-body" style={{ padding }}>
          <div className="card-text" style={{ margin }}>
            {/* Header: core change log and warning */}
            {coreChangelog || coreInstallWarning ? (
              <div style={bottomLine}>
                <div className="row">
                  <div className="col">
                    {coreChangelog ? (
                      <div>
                        <strong>Core {coreManifest.version} changelog: </strong>{" "}
                        <TextWithUrls text={coreChangelog} />
                      </div>
                    ) : null}
                    {coreInstallWarning ? (
                      <div
                        className="alert alert-warning"
                        style={{ margin: "12px 0 6px 0" }}
                      >
                        <TextWithUrls text={coreInstallWarning} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Dedicated per core version update and warnings */}
            {coreDeps.sort(byName).map((dep, i) => {
              const installWarning = ((dep.manifest || {}).warnings || {})
                .onInstall;
              const updateType = computeSemverUpdateType(dep.from, dep.to);
              const showBadge =
                updateType === "downgrade" || updateType === "major";
              return (
                <div key={i} style={bottomLine}>
                  <div className="row">
                    <div className="col-sm-6 text-truncate">
                      <DnpName dnpName={dep.name} />
                    </div>
                    <div className="col-sm-6 text-truncate">
                      {dep.from
                        ? `Update from ${dep.from} to ${dep.to}`
                        : `Install ${dep.to}`}
                      {showBadge ? (
                        <span
                          className={`badge badge-warning`}
                          style={{
                            textTransform: "capitalize",
                            marginLeft: "6px"
                          }}
                        >
                          {updateType}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {installWarning ? (
                    <div className="row">
                      <div className="col">
                        <div
                          className="alert alert-warning"
                          style={{ margin: "12px 0 6px 0" }}
                        >
                          <TextWithUrls text={installWarning} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Update button */}
          <div className="float-right" style={{ margin }}>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={updateCore}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SystemUpdateDetails.propTypes = {
  coreDeps: PropTypes.array.isRequired,
  coreManifest: PropTypes.object
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: s.coreDeps,
  coreManifest: s.coreManifest
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore: a.updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdateDetails);
