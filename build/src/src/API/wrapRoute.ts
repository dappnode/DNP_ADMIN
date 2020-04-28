import Ajv from "ajv";
import { mapValues } from "lodash";
import { getSession } from "./start";
import Toast from "components/toast/Toast";
import { getValidator } from "utils/schemaValidation";
import { callRoute } from "common/transport/autobahn";
import { routesData, Routes } from "common/routes";

const ajv = new Ajv();

interface WampCallOptions {
  toastMessage?: string;
  toastOnError?: boolean;
}

const calls: Routes = mapValues(routesData, (data, route) => {
  return async function(...args: any[]) {
    const session = getSession();
    // If session is not available, fail gently
    if (!session) throw Error("Session object is not defined");
    if (!session.isOpen) throw Error("Connection is not open");

    return await callRoute<any>(session, route, args);
  };
});

// export function wrapRoute<T, R>({
//   route,
//   requestDataSchema,
//   returnDataSchema
// }: {
//   route: string;
//   requestDataSchema?: object;
//   returnDataSchema?: object;
//   requestDataSample?: T;
//   returnDataSample?: R;
// }) {
//   const validateRequest = requestDataSchema
//     ? ajv.compile(requestDataSchema)
//     : null;
//   const validateReturn = returnDataSchema
//     ? getValidator<R>(returnDataSchema, "result")
//     : null;

//   return async function wampCall(
//     kwargs: T,
//     options?: WampCallOptions
//   ): Promise<R> {
//     // Toast visualization options

//     const { toastMessage, toastOnError } = options || {};

//     const pendingToast = toastMessage
//       ? Toast({ message: toastMessage, pending: true })
//       : null;

//     try {
//       if (validateRequest) {
//         const validRequest = validateRequest(kwargs);
//         if (!validRequest) console.error(validateRequest.errors);
//       }

//       // Get session
//       const session = getSession();
//       // If session is not available, fail gently
//       if (!session) throw Error("Session object is not defined");
//       if (!session.isOpen) throw Error("Connection is not open");

//       if (pendingToast) pendingToast.resolve(result);
//       return validateReturn ? validateReturn(result) : result;
//     } catch (e) {
//       // Intercept errors to resolve or create toasts
//       // Re-throw the error afterwards
//       if (toastOnError) {
//         Toast({ success: false, message: e.message });
//       } else if (pendingToast) {
//         pendingToast.resolve({ success: false, message: e.message });
//       }

//       console.error(`Error on ${route}: ${e.stack}`);
//       throw e;
//     }
//   };
// }
