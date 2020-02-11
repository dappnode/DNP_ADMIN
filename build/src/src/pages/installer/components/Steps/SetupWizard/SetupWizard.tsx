import React, { useState, useEffect, useCallback } from "react";
import { mapValues, memoize } from "lodash";
import deepmerge from "deepmerge";
// Components
import Card from "components/Card";
import Alert from "react-bootstrap/Alert";
import { UserSettingsAllDnps, SetupWizardAllDnps } from "types";
import { shortNameCapitalized } from "utils/format";
import OldEditor from "./OldEditor";
import {
  formDataToUserSettings,
  userSettingsToFormData,
  setupWizardToSetupTarget,
  filterByActiveSetupWizardFields
} from "pages/installer/parsers/formDataParser";
import Button from "components/Button";
import InputField from "./InputField";
import { parseSetupWizardErrors } from "pages/installer/parsers/formDataErrors";
import "./setupWizard.scss";

interface SetupWizardProps {
  setupWizard: SetupWizardAllDnps;
  userSettings: UserSettingsAllDnps;
  prevUserSettings: UserSettingsAllDnps;
  wizardAvailable: boolean;
  onSubmit: (newUserSettings: UserSettingsAllDnps) => void;
  goBack: () => void;
}

interface NewEditorProps {
  userSettings: UserSettingsAllDnps;
  setupWizard: SetupWizardAllDnps;
  onChange: (newUserSettings: UserSettingsAllDnps) => void;
}

const NewEditor: React.FunctionComponent<NewEditorProps> = ({
  userSettings,
  setupWizard,
  onChange
}) => {
  const setupTarget = setupWizardToSetupTarget(setupWizard);
  const formData = userSettingsToFormData(userSettings, setupTarget);

  const setupWizardOnlyActive = filterByActiveSetupWizardFields(
    setupWizard,
    formData
  );

  const dataErrors = parseSetupWizardErrors(setupWizardOnlyActive, formData);

  function setSetting(dnpName: string, id: string, newValue: string) {
    const newFormData = { [dnpName]: { [id]: newValue } };
    onChange(formDataToUserSettings(newFormData, setupTarget));
  }

  return (
    <>
      <div className="dnps-section">
        {Object.entries(setupWizardOnlyActive).map(([dnpName, fields]) => (
          <div className="dnp-section" key={dnpName}>
            <div className="dnp-name">{shortNameCapitalized(dnpName)}</div>
            {fields.map(field => {
              const value =
                (formData[dnpName] ? formData[dnpName][field.id] : "") || "";
              return (
                <div key={field.id} className="field">
                  <div className="title">{field.title}</div>
                  <div className="description">{field.description}</div>
                  <InputField
                    field={field}
                    value={value}
                    onValueChange={newValue =>
                      setSetting(dnpName, field.id, newValue)
                    }
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {dataErrors.length > 0 && (
        <Alert variant="danger">
          {dataErrors.map(({ dnpName, id, title, type, message }) => {
            const errorId = dnpName + id + type;
            return (
              <div key={errorId}>
                {shortNameCapitalized(dnpName)} - {title} - {message}
              </div>
            );
          })}
        </Alert>
      )}
    </>
  );
};

const SetupWizard: React.FunctionComponent<SetupWizardProps> = ({
  setupWizard,
  userSettings: initialUserSettings,
  wizardAvailable,
  onSubmit,
  goBack
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userSettings, setUserSettings] = useState(initialUserSettings);

  useEffect(() => {
    setUserSettings(initialUserSettings);
  }, [initialUserSettings]);

  /**
   * Merge instead of setting a new value to:
   * - Preserve the info about all available fields, NewEditor may ignore fields
   * - Allows to memo this function, which improves performance for expensive
   *   components (SelectMountpoint)
   *   NOTE: Didn't fix the problem, but the slow down is not that bad
   * @param newUserSettings Will be partial newUserSettings
   */
  function onNewUserSettings(newUserSettings: UserSettingsAllDnps) {
    setUserSettings(prevUserSettings =>
      deepmerge(prevUserSettings, newUserSettings)
    );
  }

  function handleSubmit() {
    onSubmit(userSettings);
  }

  return (
    <Card spacing noscroll className="setup-wizard">
      {showAdvanced || !wizardAvailable ? (
        <OldEditor userSettings={userSettings} onChange={onNewUserSettings} />
      ) : (
        <NewEditor
          userSettings={userSettings}
          onChange={onNewUserSettings}
          setupWizard={setupWizard}
        />
      )}

      <div className="bottom-buttons">
        <div>
          <Button onClick={goBack}>Cancel</Button>
          <Button onClick={handleSubmit} variant="dappnode">
            Submit
          </Button>
        </div>
        <div className="subtle-header" onClick={() => setShowAdvanced(x => !x)}>
          {showAdvanced ? "Hide" : "Show"} advanced editor
        </div>
      </div>
    </Card>
  );
};

export default SetupWizard;
