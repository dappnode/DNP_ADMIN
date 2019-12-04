import React, { useState, useEffect, useRef, useMemo } from "react";
import { get, isEmpty } from "lodash";
import Error from "components/generic/Error";
import Form, { FormValidation, AjvError } from "react-jsonschema-form";
import Button from "components/Button";
import RenderMarkdown from "components/RenderMarkdown";
import SelectMountpoint from "./SelectMountpoint";
import "./formJsonSchema.scss";
import { SetupUiJson, SetupSchemaAllDnpsFormated } from "types-own";

interface PropWithErrorMessages extends SetupUiJson {
  errorMessages: { [errorName: string]: string };
}

interface AjvErrorWithPath extends AjvError {
  schemaPath?: string; // "#/properties/vipnode.dnp.dappnode.eth/properties/payoutAddress/pattern"
}

const widgets = {
  selectMountpoint: SelectMountpoint
};

// Memo this component to prevent expensive MarkDown parsing
// on every single keystroke. After analyzing performance, this component
// was responsible for 20-40% of the work
const CustomDescriptionField: React.FunctionComponent<any> = ({
  description
}) =>
  useMemo(() => <RenderMarkdown source={description} spacing />, [description]);

interface FormJsonSchemaProps {
  schema: SetupSchemaAllDnpsFormated;
  uiSchema: SetupUiJson;
  formData: any;
  onChange?: (formData: any) => void;
  onSubmit: (formData: any) => void;
  onShowAdvancedEditor: (formData: any) => void;
  onCancel: () => void;
  onSubmitLabel?: string;
  onCancelLabel?: string;
}

const FormJsonSchema: React.FunctionComponent<FormJsonSchemaProps> = ({
  schema,
  uiSchema,
  formData,
  onChange,
  onSubmit,
  onShowAdvancedEditor,
  onCancel,
  onSubmitLabel = "Submit",
  onCancelLabel = "Cancel"
}) => {
  /**
   * Ugly hack to be able to get the formData when switching editors
   * If the formData is kept in state either in this component or its
   * parent the performance suffers extremely, with CPU usage of 100%
   * on fast types
   * [NOTE]: It's necessary to keep an internalFormData or the formData
   * will be replaced by the prop
   * [NOTE]: internalFormData must be undefined or null to start with,
   * or it will trigger validation before typing
   */
  const [internalFormData, setInternalFormData] = useState(undefined as any);
  const [callShowAdvancedEditor, setCallShowAdvancedEditor] = useState(false);
  const componentIsMounted = useRef(true);
  const formRef = useRef();

  useEffect(() => {
    if (isEmpty(formData) || Object.values(formData).every(isEmpty)) return;
    setInternalFormData(formData);
  }, [formData, setInternalFormData]);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  function _onShowAdvancedEditor() {
    setCallShowAdvancedEditor(true);
    setImmediate(() => {
      // @ts-ignore
      if (formRef && formRef.current) formRef.current.submit();
      setImmediate(() => {
        if (componentIsMounted.current) setCallShowAdvancedEditor(false);
      });
    });
  }

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

  const validationFunctions: ((
    formData: any,
    errors: FormValidation
  ) => FormValidation)[] = [];

  /**
   * Confirm functionality (for passwords)
   * - Automatically adds another field with name "Confirm Blabla"
   * - Makes sure the order is correct
   * - Add a validator function linking the two fields
   */
  // if (Object.values(schema.properties).some(prop => prop.confirm)) {
  //   const schemaPropsWithConfirm = {};
  //   for (const [key, prop] of Object.entries(schema.properties)) {
  //     schemaPropsWithConfirm[key] = prop;
  //     const confirmKey = `${key}-confirm`;
  //     if (prop.confirm && !schema.properties[confirmKey]) {
  //       // Add another form field
  //       schemaPropsWithConfirm[confirmKey] = {
  //         ...prop,
  //         confirm: false, // Prevent loops creating: "Confirm Confirm ..."
  //         title: `Confirm ${prop.title}`,
  //         description: undefined, // Show description once
  //         classNames: "confirm" // For styling, don't show separation top bar
  //       };
  //       // Add field to the orther if necessary
  //       if (Array.isArray(schema[uiOrderKey])) {
  //         const keyIndex = schema[uiOrderKey].indexOf(key);
  //         if (keyIndex > -1)
  //           schema[uiOrderKey].splice(keyIndex + 1, 0, confirmKey);
  //         else schema[uiOrderKey].push(confirmKey);
  //       }
  //       // Match confirm field validation function
  //       validationFunctions.push((_formData, _errors) => {
  //         if (_formData[key] !== _formData[confirmKey]) {
  //           _errors[confirmKey].addError(`Does not match ${prop.title}`);
  //         }
  //         return _errors;
  //       });
  //     }
  //   }
  //   schema.properties = schemaPropsWithConfirm;
  // }

  /**
   * Prettify errors if necessary
   */
  function transformErrors(_errors: AjvErrorWithPath[]): AjvError[] {
    return (
      _errors
        .map(error => {
          if (!error.property) return error;
          const prop = get(uiSchema, error.property) as PropWithErrorMessages;
          const errorMessage = ((prop || {}).errorMessages || {})[error.name];
          if (errorMessage) error.message = errorMessage;
          return error;
        })
        // #### PATCH / TODO: Prevent confusing error with dependencies.oneOf formula
        // used in trustlines to allow conditional fields
        .filter(
          error => error.message !== "should match exactly one schema in oneOf"
        )
    );
  }

  /**
   * Run validation functions
   */
  function validate(_formData: any, _errors: FormValidation) {
    for (const validationFunction of validationFunctions) {
      _errors = validationFunction(_formData, _errors);
    }
    return _errors;
  }

  return (
    <>
      <Form
        // @ts-ignore
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        onChange={e => {
          if (onChange) onChange(e.formData);
          setInternalFormData(e.formData);
        }}
        onSubmit={e => {
          if (!e.formData) return false;
          if (callShowAdvancedEditor) onShowAdvancedEditor(e.formData);
          else onSubmit(e.formData);
        }}
        // // Disabled `liveValidate` to prevent pattern errors to show immediately, which is very annoying
        // liveValidate
        // showErrorList={false}
        // onError={console.log}
        transformErrors={transformErrors}
        validate={validate}
        fields={fields}
        formData={internalFormData}
        widgets={widgets}
      >
        <div className="bottom-buttons">
          <div>
            {onCancel && (
              <Button className="cancel-button" onClick={onCancel}>
                {onCancelLabel}
              </Button>
            )}
            <Button type={"sumbit" as "submit"} variant="dappnode">
              {onSubmitLabel}
            </Button>
          </div>
          <div className="subtle-header" onClick={_onShowAdvancedEditor}>
            Show advanced editor
          </div>
        </div>
      </Form>

      {/* {errors.length > 0 && (
        <Alert variant="danger">
          <Alert.Heading>Errors</Alert.Heading>
          <ul>
            {errors.map(({ stack }) => {
              // Try to replace the prop id with it's pretty name
              const propId = stack.split(":")[0];
              const prop = (schema.properties || {})[propId];
              const name = prop && typeof prop === "object" ? prop.title : "";
              return (
                <li key={stack}>
                  {name ? stack.replace(propId, name) : stack}
                </li>
              );
            })}
          </ul>
        </Alert>
      )} */}
    </>
  );
};

export default React.memo(FormJsonSchema);
