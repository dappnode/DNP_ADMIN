import Ajv from "ajv";
import { getSession } from "./start";
import Toast from "components/toast/Toast";

const ajv = new Ajv();

interface WampCallOptions {
  toastMessage?: string;
  toastOnError?: boolean;
}

interface CrossbarError extends Error {
  args?: any[];
  error?: string;
}

export function wrapRoute<T, R>({
  route,
  requestDataSchema,
  returnDataSchema
}: {
  route: string;
  requestDataSchema?: object;
  returnDataSchema?: object;
}) {
  const validateRequest = requestDataSchema
    ? ajv.compile(requestDataSchema)
    : null;
  const validateReturn = returnDataSchema
    ? ajv.compile(returnDataSchema)
    : null;

  return async function wampCall(
    kwargs: T,
    options?: WampCallOptions
  ): Promise<R> {
    // Toast visualization options

    const { toastMessage, toastOnError } = options || {};

    const pendingToast = toastMessage
      ? Toast({ message: toastMessage, pending: true })
      : null;

    try {
      if (validateRequest) {
        const validRequest = validateRequest(kwargs);
        if (!validRequest) console.error(validateRequest.errors);
      }

      // Get session
      const session = getSession();
      // If session is not available, fail gently
      if (!session) throw Error("Session object is not defined");
      if (!session.isOpen) throw Error("Connection is not open");

      const res = await session
        .call(route, [], kwargs)
        // @ts-ignore
        .then(JSON.parse)
        .catch((e: CrossbarError) => {
          // crossbar return errors in a specific format
          throw Error(e.message || (e.args && e.args[0] ? e.args[0] : e.error));
        });

      if (!res.success) throw Error(res.message);
      if (pendingToast) pendingToast.resolve(res);

      if (validateReturn) {
        const validReturn = validateReturn(res.result);
        if (!validReturn) console.error(validateReturn.errors);
      }

      return res.result;
    } catch (e) {
      // Intercept errors to resolve or create toasts
      // Re-throw the error afterwards
      if (toastOnError) {
        Toast({ success: false, message: e.message });
      } else if (pendingToast) {
        pendingToast.resolve({ success: false, message: e.message });
      }

      console.error(`Error on ${route}: ${e.stack}`);
      throw e;
    }
  };
}
