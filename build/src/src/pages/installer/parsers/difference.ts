import { transform, isEqual, isObject } from "lodash";

export default function difference(base: any, object: any) {
  function changes(base: any, object: any) {
    return transform(
      object,
      (result: any, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] =
            isObject(value) && isObject(base[key])
              ? changes(base[key], value)
              : value;
        }
      },
      {}
    );
  }
  return changes(base, object);
}
