import React, { useState, useEffect, useCallback, useMemo } from "react";
import { mapValues } from "lodash";
// Components
import Card from "components/Card";
import FormJsonSchema from "./FormJsonSchema";
import {
  SetupSchemaAllDnps,
  SetupUiJsonAllDnps,
  UserSettingsAllDnps,
  SetupSchemaAllDnpsFormated
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
  setupUiJson: SetupUiJsonAllDnps;
  userSettings: UserSettingsAllDnps;
  wizardAvailable: boolean;
  onSubmit: (newUserSettings: UserSettingsAllDnps) => void;
  goBack: () => void;
}

const SetupWizard: React.FunctionComponent<SetupWizardProps> = ({
  setupSchema,
  setupUiJson,
  userSettings,
  wizardAvailable,
  onSubmit,
  goBack
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editorData, setEditorData] = useState({} as UserSettingsAllDnps);
  const [wizardData, setWizardData] = useState({} as SetupWizardFormDataReturn);

  useEffect(() => {
    setEditorData(userSettings);
    setWizardData(userSettingsToFormData(userSettings, setupSchema));
  }, [userSettings, setupSchema]);

  // [NOTE]: All handlers for the FormJsonSchema are memoized to prevent
  // expensive re-renders that cause serious performance issues
  // (100% CPU + freezing for 200-500 ms)

  // Move data from the wizard to the editor
  // Deepmerge to include settings not found in the wizard schema
  // Store the wizard data for cache in the case th user switches back
  const onShowAdvancedEditor = useCallback(
    formData => {
      setEditorData(_editorData =>
        deepmerge(_editorData, formDataToUserSettings(formData, setupSchema))
      );
      setWizardData(formData);
      setShowAdvanced(true);
    },
    [setupSchema, setEditorData, setWizardData, setShowAdvanced]
  );

  // Move data from the editor to the wizard
  // Deepmerge to include data not found in the user settings (fileUploads)
  const onHideAdvancedEditor = useCallback(() => {
    setWizardData(_wizardData =>
      deepmerge(_wizardData, userSettingsToFormData(editorData, setupSchema))
    );
    setShowAdvanced(false);
  }, [setupSchema, setWizardData, editorData, setShowAdvanced]);

  // Merge wizard data with the editor data. Give priority to the wizard data
  const onWizardSubmit = useCallback(
    formData => {
      console.log("Submited wizard editor");
      const wizardSettings = formDataToUserSettings(formData, setupSchema);
      onSubmit(deepmerge(editorData, wizardSettings));
    },
    [onSubmit, setupSchema, editorData]
  );

  // Merge editor data with the wizard data. Give priority to the editor data
  const onOldEditorSubmit = useCallback(() => {
    console.log("Submited old editor");
    if (wizardAvailable) {
      const wizardSettings = formDataToUserSettings(wizardData, setupSchema);
      onSubmit(deepmerge(wizardSettings, editorData));
    } else {
      onSubmit(editorData);
    }
  }, [onSubmit, setupSchema, wizardAvailable, wizardData, editorData]);

  // Pretify the titles of the DNP sections
  // and convert it to a valid JSON schema where the top properties are each DNP
  const setupSchemaFormated: SetupSchemaAllDnpsFormated = useMemo(() => {
    return {
      type: "object",
      properties: mapValues(setupSchema, (schema, dnpName) => ({
        title: shortNameCapitalized(dnpName),
        ...schema
      }))
    };
  }, [setupSchema]);

  return (
    <Card spacing>
      {showAdvanced || !wizardAvailable ? (
        <OldEditor
          userSettings={editorData}
          onCancel={goBack}
          onChange={setEditorData}
          onSubmit={onOldEditorSubmit}
          onHideAdvancedEditor={onHideAdvancedEditor}
          canBeHidded={wizardAvailable}
        />
      ) : (
        <FormJsonSchema
          schema={setupSchemaFormated}
          uiSchema={setupUiJson}
          formData={wizardData}
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
