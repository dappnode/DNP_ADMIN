import { UiSchema } from "react-jsonschema-form";
import { JSONSchema6 } from "json-schema";
import { SetupSchemaAllDnps } from "types";

// Setup schema types
export type SetupSchema = JSONSchema6;
export type SetupUiJson = UiSchema;

export interface SetupSchemaAllDnpsFormated {
  type: "object";
  properties: SetupSchemaAllDnps;
}
