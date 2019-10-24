import React from "react";
// Components
import Card from "components/Card";
import FormJsonSchema from "components/FormJsonSchema";
import { SetupSchema, SetupUiSchema } from "types";

interface SetupWizardProps {
  setupSchema: SetupSchema;
  setupUiSchema: SetupUiSchema;
  initialFormData: any;
  onSubmit: (formData: any) => void;
  goBack: () => void;
}

const SetupWizard: React.FunctionComponent<SetupWizardProps> = ({
  setupSchema,
  setupUiSchema,
  initialFormData,
  onSubmit,
  goBack
}) => {
  function _onSubmit(formData: any) {
    onSubmit(formData);
  }

  return (
    <Card spacing>
      <FormJsonSchema
        schema={setupSchema}
        uiSchema={setupUiSchema}
        initialFormData={initialFormData}
        onSubmit={_onSubmit}
        onCancel={() => goBack()}
        onSubmitLabel="Submit"
        onCancelLabel="Back"
      ></FormJsonSchema>
    </Card>
  );
};

export default SetupWizard;
