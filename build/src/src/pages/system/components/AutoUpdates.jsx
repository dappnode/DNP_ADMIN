import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import semver from "semver";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Switch from "components/Switch";
import { shortNameCapitalized } from "utils/format";
// External
import { getAutoUpdateSettings } from "services/dappnodeStatus/selectors";
import { fetchAutoUpdateSettings } from "services/dappnodeStatus/actions";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
// Styles
import "./autoUpdates.scss";

const MY_PACKAGES = "my-packages";
const SYSTEM_PACKAGES = "system-packages";

function AutoUpdates({
  autoUpdateSettings,
  dnpInstalled,
  fetchAutoUpdateSettings
}) {
  const updatableIds = [
    SYSTEM_PACKAGES,
    MY_PACKAGES,
    ...(autoUpdateSettings[MY_PACKAGES]
      ? dnpInstalled
          .filter(dnp => dnp.isDnp && semver.valid(dnp.version))
          .map(dnp => dnp.name)
      : [])
  ];

  function setUpdateSettings(id, enabled) {
    api
      .autoUpdateSettingsEdit(
        { id, enabled },
        {
          toastMessage: `${
            enabled ? "Enabling" : "Disabling"
          } auto updates for ${shortNameCapitalized(id)}...`
        }
      )
      .then(() => fetchAutoUpdateSettings())
      .catch(console.error);
  }

  return (
    <>
      <SubTitle>Auto-updates</SubTitle>
      <Card>
        <div className="auto-updates-explanation">
          Enable auto-updates for DAppNode to stay automatically up to date to
          the latest updates. <strong>Note</strong> that for major breaking
          updates, the interaction of an admin will always be required.
        </div>

        <div className="list-grid auto-updates">
          <hr />
          {updatableIds.map(id => {
            const isSinglePackage =
              id !== MY_PACKAGES && id !== SYSTEM_PACKAGES;
            const enabled = isSinglePackage
              ? autoUpdateSettings[MY_PACKAGES] &&
                !autoUpdateSettings[MY_PACKAGES][id]
              : autoUpdateSettings[id];
            return (
              <React.Fragment key={id}>
                <span
                  className={`stateBadge center badge-${
                    enabled ? "success" : "secondary"
                  }`}
                  style={{ opacity: 0.85 }}
                >
                  <span className="content">{enabled ? "on" : "off"}</span>
                </span>

                <span className="name">
                  {isSinglePackage && <span>> </span>}
                  {shortNameCapitalized(id)}
                </span>

                <Switch
                  checked={enabled ? true : false}
                  onToggle={() => setUpdateSettings(id, !Boolean(enabled))}
                />

                <hr />
              </React.Fragment>
            );
          })}
        </div>
      </Card>
    </>
  );
}

AutoUpdates.propTypes = {
  autoUpdateSettings: PropTypes.object.isRequired,
  dnpInstalled: PropTypes.array.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  autoUpdateSettings: getAutoUpdateSettings,
  dnpInstalled: getDnpInstalled
});

const mapDispatchToProps = {
  fetchAutoUpdateSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);
