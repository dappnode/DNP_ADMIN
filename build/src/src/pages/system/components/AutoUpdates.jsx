import React, { useState } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Switch from "components/Switch";
import { shortNameCapitalized } from "utils/format";
// External
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { getAutoUpdateSettings } from "services/dappnodeStatus/selectors";
import { fetchAutoUpdateSettings } from "services/dappnodeStatus/actions";
import { coreName } from "services/coreUpdate/data";

const options = [
  { value: "off", text: "Off" },
  { value: "patch", text: "Security updates" },
  { value: "minor", text: "All updates" }
];
const MY_PACKAGES = "my-packages";

function AutoUpdates({ dnps, autoUpdateSettings, fetchAutoUpdateSettings }) {
  const [showDetailed, setShowDetailed] = useState(false);

  const dnpsToShow = [
    { name: "System packages", key: "core.dnp.dappnode.eth" },
    { name: "My Packages", key: MY_PACKAGES },
    ...(showDetailed
      ? dnps
          .filter(dnp => !dnp.isCore && dnp.name !== MY_PACKAGES)
          .map(({ name }) => ({ name, key: name }))
      : [])
  ];

  function setUpdateSettings(id, updateType) {
    const extraOpts =
      id === MY_PACKAGES ? { generalSettings: true, applyToAll: true } : {};
    api
      .autoUpdateSettingsEdit(
        { id, settings: updateType, ...extraOpts },
        { toastMessage: `Editting update settings for ${id}...` }
      )
      .then(res => {
        console.log(res);
        fetchAutoUpdateSettings();
      })
      .catch(e => {
        console.error(e);
      });
  }

  // useEffect(() => {
  //   setInput(staticIp);
  // }, [staticIp]);

  // const update = () => {
  //   if (isIpv4(input)) setStaticIp(input);
  // };

  return (
    <>
      <SubTitle>Auto-updates</SubTitle>
      <Card>
        <div className="auto-updates-explanation">
          Enable auto-updates for DAppNode to stay automatically up to date to
          the latest security updates. The interaction of an admin will always
          be required for major breaking updates.
        </div>

        <div className="list-grid auto-updates">
          <hr />
          {dnpsToShow.map(({ name, key }) => {
            const setting =
              autoUpdateSettings[key] ||
              (key !== coreName && autoUpdateSettings[MY_PACKAGES]) ||
              "off";
            const active = setting !== "off";

            return (
              <React.Fragment key={name}>
                <span
                  className={`stateBadge center badge-${
                    active ? "success" : "secondary"
                  }`}
                  style={{ opacity: 0.85 }}
                >
                  <span className="content">{active ? "on" : "off"}</span>
                </span>

                <span className="name">{shortNameCapitalized(name)}</span>

                <select
                  className="custom-select"
                  onChange={e => setUpdateSettings(key, e.target.value)}
                  value={setting}
                >
                  {options
                    // Don't show the "Follow general setting" for the general setting
                    .filter(
                      ({ value }) => key !== coreName || value !== "minor"
                    )
                    .map(({ value, text }) => (
                      <option key={value} value={value}>
                        {text}
                      </option>
                    ))}
                </select>

                <hr />
              </React.Fragment>
            );
          })}
          <hr />
        </div>
        <div className="show-detailed-options">
          <Switch
            checked={showDetailed}
            label={"Show detailed by package settings"}
            onToggle={() => setShowDetailed(x => !x)}
          />
        </div>
      </Card>
    </>
  );
}

AutoUpdates.propTypes = {
  dnps: PropTypes.array.isRequired,
  autoUpdateSettings: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  dnps: getDnpInstalled,
  autoUpdateSettings: getAutoUpdateSettings
});

const mapDispatchToProps = {
  fetchAutoUpdateSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);
