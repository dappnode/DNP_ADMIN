import React, { useState, useEffect, useCallback } from "react";
import { mapValues } from "lodash";
// Components
import Card from "components/Card";
import FormJsonSchema from "./FormJsonSchema";
import {
  SetupSchemaAllDnps,
  SetupUiSchemaAllDnps,
  UserSettingsAllDnps
} from "types";
import { shortNameCapitalized } from "utils/format";
import OldEditor from "./OldEditor";
import {
  formDataToUserSettings,
  userSettingsToFormData
} from "pages/installer/parsers/formDataParser";
import { SetupWizardFormDataReturn } from "pages/installer/types";
import deepmerge from "deepmerge";

interface SetupWizardProps {
  setupSchema: SetupSchemaAllDnps;
  setupUiSchema: SetupUiSchemaAllDnps;
  userSettings: UserSettingsAllDnps;
  onSubmit: (newUserSettings: UserSettingsAllDnps) => void;
  goBack: () => void;
}

const SetupWizard: React.FunctionComponent<SetupWizardProps> = ({
  setupSchema,
  setupUiSchema,
  userSettings,
  onSubmit,
  goBack
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [oldEditorData, setOldEditorData] = useState({} as UserSettingsAllDnps);
  const [wizardFormData, setWizardFormData] = useState(
    {} as SetupWizardFormDataReturn
  );

  useEffect(() => {
    setOldEditorData(userSettings);
    setWizardFormData(userSettingsToFormData(userSettings, setupSchema));
  }, [userSettings, setupSchema]);

  const onShowAdvancedEditor = useCallback(
    formData => {
      setOldEditorData(_oldEditorData =>
        deepmerge(_oldEditorData, formDataToUserSettings(formData, setupSchema))
      );
      setWizardFormData(formData);
      setShowAdvanced(true);
    },
    [setupSchema, setOldEditorData, setWizardFormData, setShowAdvanced]
  );

  const onHideAdvancedEditor = useCallback(() => {
    setWizardFormData(_wizardFormData =>
      deepmerge(
        _wizardFormData,
        userSettingsToFormData(oldEditorData, setupSchema)
      )
    );
    setShowAdvanced(false);
  }, [setupSchema, setWizardFormData, oldEditorData, setShowAdvanced]);

  const onWizardSubmit = useCallback(
    formData => {
      console.log("Submited wizard editor");
      const wizardSettings = formDataToUserSettings(formData, setupSchema);
      // If submitted from wizard, give priority to wizard settings
      onSubmit(deepmerge(oldEditorData, wizardSettings));
    },
    [onSubmit, setupSchema, oldEditorData]
  );

  const onOldEditorSubmit = useCallback(() => {
    console.log("Submited old editor");
    const wizardSettings = formDataToUserSettings(wizardFormData, setupSchema);
    // If submitted from old editor, give priority to old editor
    onSubmit(deepmerge(wizardSettings, oldEditorData));
  }, [onSubmit, setupSchema, wizardFormData, oldEditorData]);

  // Pretify the titles of the DNP sections
  if (setupSchema.properties)
    setupSchema.properties = mapValues(
      setupSchema.properties,
      (schema, dnpName) => ({
        title: shortNameCapitalized(dnpName),
        ...schema
      })
    );

  return (
    <Card spacing>
      {showAdvanced ? (
        <OldEditor
          userSettings={oldEditorData}
          onCancel={goBack}
          onChange={setOldEditorData}
          onSubmit={onOldEditorSubmit}
          onHideAdvancedEditor={onHideAdvancedEditor}
        />
      ) : (
        <FormJsonSchema
          schema={setupSchema}
          uiSchema={setupUiSchema}
          formData={wizardFormData}
          // onChange={() => {}}
          onSubmit={onWizardSubmit}
          onShowAdvancedEditor={onShowAdvancedEditor}
          onCancel={goBack}
          onSubmitLabel="Submit"
          onCancelLabel="Back"
        />
      )}
    </Card>
  );
};

export default SetupWizard;
