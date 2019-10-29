import { isEmpty } from "lodash";
import { SetupSchemaAllDnps } from "types";
import { isDeepEmpty } from "utils/lodashExtended";

export function setupSchemaIsEmpty(setupSchema: SetupSchemaAllDnps) {
  return isEmpty(setupSchema) || isDeepEmpty(setupSchema.properties);
}
