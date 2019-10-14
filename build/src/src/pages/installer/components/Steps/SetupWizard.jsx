import React from "react";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import FormJsonSchema from "components/FormJsonSchema";

export default function SetupWizard({
  wizard,
  initialFormData,
  onSubmit,
  onChange,
  goBack
}) {
  function _onSubmit(formData) {
    onSubmit(formData);
  }

  return (
    <Card spacing>
      <FormJsonSchema
        schema={wizard}
        initialFormData={initialFormData}
        onSubmit={_onSubmit}
        onCancel={() => goBack()}
        onChange={onChange}
        onSubmitLabel="Submit"
        onCancelLabel="Back"
      ></FormJsonSchema>
    </Card>
  );
}

SetupWizard.propTypes = {
  dnp: PropTypes.object
};
