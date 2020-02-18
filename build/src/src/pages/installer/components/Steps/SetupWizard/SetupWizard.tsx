import React, { useState, useEffect } from "react";
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
  filterActiveSetupWizard
} from "pages/installer/parsers/formDataParser";
import RenderMarkdown from "components/RenderMarkdown";
import Button from "components/Button";
import InputField from "./InputField";
import {
  parseSetupWizardErrors,
  SetupWizardError
} from "pages/installer/parsers/formDataErrors";
import "./setupWizard.scss";
import { SetupWizardFormDataReturn } from "pages/installer/types";

function NewEditor({
  setupWizard,
  formData,
  errors,
  onNewFormData
}: {
  setupWizard: SetupWizardAllDnps;
  formData: SetupWizardFormDataReturn;
  errors: SetupWizardError[];
  onNewFormData: (newFormData: SetupWizardFormDataReturn) => void;
}) {
  return (
    <>
      <div className="dnps-section">
        {Object.entries(setupWizard).map(([dnpName, setupWizardDnp]) => (
          <div className="dnp-section" key={dnpName}>
            <div className="dnp-name">{shortNameCapitalized(dnpName)}</div>
            {setupWizardDnp.fields.map(field => {
              const { id } = field;
              const ownErrors = errors.filter(
                error => error.dnpName === dnpName && error.id === id
              );
              return (
                <div key={id} className="field">
                  <div className="title">{field.title}</div>
                  <div className="description">
                    <RenderMarkdown source={field.description} />
                  </div>
                  <InputField
                    field={field}
                    value={(formData[dnpName] || {})[id] || ""}
                    onValueChange={newValue =>
                      onNewFormData({ [dnpName]: { [id]: newValue } })
                    }
                  />
                  {ownErrors.map(error => (
                    <div key={error.type} className="error">
                      {error.message}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function SetupWizard({
  setupWizard,
  userSettings: initialUserSettings,
  wizardAvailable,
  onSubmit,
  goBack
}: {
  setupWizard: SetupWizardAllDnps;
  userSettings: UserSettingsAllDnps;
  wizardAvailable: boolean;
  onSubmit: (newUserSettings: UserSettingsAllDnps) => void;
  goBack: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userSettings, setUserSettings] = useState(initialUserSettings);

  useEffect(() => {
    setUserSettings(initialUserSettings);
  }, [initialUserSettings]);

  // New editor data
  const setupTarget = setupWizardToSetupTarget(setupWizard);
  const formData = userSettingsToFormData(userSettings, setupTarget);
  const setupWizardActive = filterActiveSetupWizard(setupWizard, formData);
  const dataErrors = parseSetupWizardErrors(setupWizardActive, formData);
  const visibleDataErrors = dataErrors.filter(
    error => submitting || error.type !== "empty"
  );

  /**
   * Merge instead of setting a new value to:
   * - Preserve the info about all available fields, NewEditor may ignore fields
   * - Allows to memo this function, which improves performance for expensive
   *   components (SelectMountpoint)
   *   NOTE: Didn't fix the problem, but the slow down is not that bad
   * @param newUserSettings Will be partial newUserSettings
   */
  function onNewUserSettings(newUserSettings: UserSettingsAllDnps) {
    setSubmitting(false);
    setUserSettings(prevUserSettings =>
      deepmerge(prevUserSettings, newUserSettings)
    );
  }

  /**
   * Convert the Editor's formData object to a userSettings given a setupTarget
   */
  function onNewFormData(newFormData: SetupWizardFormDataReturn) {
    const newUserSettings = formDataToUserSettings(newFormData, setupTarget);
    onNewUserSettings(newUserSettings);
  }

  /**
   * On submit show the "empty" type errors if any by switching to `submitting` mode
   * Otherwise, submit the current userSettings
   */
  function handleSubmit() {
    if (dataErrors.length) setSubmitting(true);
    else onSubmit(userSettings);
  }

  return (
    <Card spacing noscroll className="setup-wizard">
      {showAdvanced || !wizardAvailable ? (
        <OldEditor userSettings={userSettings} onChange={onNewUserSettings} />
      ) : (
        <NewEditor
          formData={formData}
          errors={visibleDataErrors}
          setupWizard={setupWizardActive}
          onNewFormData={onNewFormData}
        />
      )}

      {visibleDataErrors.length > 0 && (
        <Alert variant="danger">
          {visibleDataErrors.map(({ dnpName, id, title, type, message }) => (
            <div key={dnpName + id + type}>
              {shortNameCapitalized(dnpName)} - {title} - {message}
            </div>
          ))}
        </Alert>
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
}

export default SetupWizard;
