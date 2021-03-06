import Ajv, { ErrorObject } from "ajv";

const ajv = new Ajv({ allErrors: true });

export function getValidator<T>(schema: any, dataVar?: string): (data: T) => T {
  const name = dataVar || schema.title || "data";
  // Special validator where it checks each item individually
  if (schema.type === "array" && schema.items) {
    const validateItem = ajv.compile(schema.items);
    const itemName = schema.items.title || `${name} item`;
    // @ts-ignore
    return data => {
      if (!Array.isArray(data)) throw Error("data must be an array");
      let errorCache: string = "";
      // @ts-ignore
      const validItems = data.filter(item => {
        const isValid = validateItem(item);
        if (!isValid) {
          const { errors } = validateItem;
          const errorText = formatErrors(errors, itemName);
          if (errorCache !== errorText)
            console.error(errorCache, { item, errors });
          errorCache = errorText;
        }
        return isValid;
      });
      // @ts-ignore
      if (data.length && !validItems.length) throw Error(errorCache);
      else return validItems;
    };
  } else {
    const validate = ajv.compile(schema);
    return (data: T) => {
      if (!validate(data)) {
        const { errors } = validate;
        const prettyErrors = formatErrors(errors, name);
        console.error(prettyErrors, { data, errors });
        throw Error(prettyErrors);
      }
      return data;
    };
  }
}

function formatErrors(
  errors: Array<ErrorObject> | null | undefined,
  dataVar: string
) {
  return (
    "Validation error:\n" + ajv.errorsText(errors, { separator: "\n", dataVar })
  );
}
