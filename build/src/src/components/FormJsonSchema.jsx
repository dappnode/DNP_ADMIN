import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { mapValues, pickBy, get } from "lodash";
import Error from "components/generic/Error";
import Form from "react-jsonschema-form";
import Button from "components/Button";
import Alert from "react-bootstrap/Alert";
import ReactMarkdown from "react-markdown";
import "./formJsonSchema.scss";

const uiOrderKey = "ui:order";

const CustomDescriptionField = ({ id, description }) => {
  return <ReactMarkdown id={id} source={description} />;
};

export default function FormJsonSchema({
  schema,
  initialFormData,
  onSubmit,
  onCancel,
  onSubmitLabel = "Submit",
  onCancelLabel = "Cancel",
  onChange,
  disabled,
  ...props
}) {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState(undefined);

  useEffect(() => {
    if (!isEmpty(initialFormData)) setFormData(initialFormData);
  }, [initialFormData]);

  /**
   * Sanitize schema
   * - Only accept first level object type
   */
  if (typeof schema !== "object")
    return <Error msg={`Schema must be an object`} />;
  if (schema.type !== "object")
    return <Error msg={`Wizard schema must be of type object`} />;
  if (typeof schema.properties !== "object")
    return <Error msg={`Wizard .properties must be an object`} />;

  const fields = {
    DescriptionField: CustomDescriptionField
  };

  function _onSubmit(e) {
    if (e.preventDefault) e.preventDefault();
    if (!e.formData) return false;
    setErrors([]);
    setFormData(e.formData);
    onSubmit(e.formData);
  }

  function _onChange(e) {
    if (onChange) onChange(e.formData);
    // console.log("Changed", e.formData, e.errors);
  }

  const validationFunctions = [];

  /**
   * Confirm functionality (for passwords)
   * - Automatically adds another field with name "Confirm Blabla"
   * - Makes sure the order is correct
   * - Add a validator function linking the two fields
   */
  if (Object.values(schema.properties).some(prop => prop.confirm)) {
    const schemaPropsWithConfirm = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      schemaPropsWithConfirm[key] = prop;
      const confirmKey = `${key}-confirm`;
      if (prop.confirm && !schema.properties[confirmKey]) {
        // Add another form field
        schemaPropsWithConfirm[confirmKey] = {
          ...prop,
          confirm: false, // Prevent loops creating: "Confirm Confirm ..."
          title: `Confirm ${prop.title}`,
          description: undefined, // Show description once
          classNames: "confirm" // For styling, don't show separation top bar
        };
        // Add field to the orther if necessary
        if (Array.isArray(schema[uiOrderKey])) {
          const keyIndex = schema[uiOrderKey].indexOf(key);
          if (keyIndex > -1)
            schema[uiOrderKey].splice(keyIndex + 1, 0, confirmKey);
          else schema[uiOrderKey].push(confirmKey);
        }
        // Match confirm field validation function
        validationFunctions.push((_formData, _errors) => {
          if (_formData[key] !== _formData[confirmKey]) {
            _errors[confirmKey].addError(`Does not match ${prop.title}`);
          }
          return _errors;
        });
      }
    }
    schema.properties = schemaPropsWithConfirm;
  }

  /**
   * Prettify errors if necessary
   */
  function transformErrors(_errors) {
    return _errors.map(error => {
      const propPath = (error.property || "").replace(/^\./, "");
      const prop = get(schema.properties, propPath);
      const errorMessage = ((prop || {}).customErrors || {})[error.name];
      if (errorMessage) error.message = errorMessage;
      return error;
    });
  }

  /**
   * Run validation functions
   */
  function validate(_formData, _errors) {
    for (const validationFunction of validationFunctions) {
      _errors = validationFunction(_formData, _errors);
    }
    return _errors;
  }

  /**
   * Auto-generate the uiSchema from ui: props in the actual schema
   */
  // const uiWidget = "ui:widget";
  const pickByUi = prop =>
    pickBy(prop, (_0, key) => key.startsWith("ui:") || key === "classNames");
  const uiSchema = {
    ...pickByUi(schema),
    ...mapValues(schema.properties, pickByUi)
  };

  return (
    <>
      <Form
        {...props}
        schema={schema}
        uiSchema={uiSchema}
        onChange={_onChange}
        onSubmit={_onSubmit}
        onError={setErrors}
        liveValidate
        showErrorList={false}
        transformErrors={transformErrors}
        validate={validate}
        fields={fields}
        formData={formData} // To prevent losing the info on submit
      >
        {onCancel && (
          <Button className="cancel-button" onClick={onCancel}>
            {onCancelLabel}
          </Button>
        )}
        <Button type="sumbit" variant="dappnode" disabled={disabled}>
          {onSubmitLabel}
        </Button>
      </Form>
      {errors.length > 0 && (
        <Alert variant="danger">
          <Alert.Heading>Errors</Alert.Heading>
          <ul>
            {errors.map(({ stack }) => {
              // Try to replace the prop id with it's pretty name
              const propId = stack.split(":")[0];
              const name = ((schema.properties || {})[propId] || {}).title;
              return (
                <li key={stack}>
                  {name ? stack.replace(propId, name) : stack}
                </li>
              );
            })}
          </ul>
        </Alert>
      )}
    </>
  );
}

FormJsonSchema.propTypes = {
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  buttonLabel: PropTypes.string
};
