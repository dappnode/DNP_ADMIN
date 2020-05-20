import express from "express";
import Ajv from "ajv";
import { Routes, routesArgumentsSchema } from "../src/common";

const ajv = new Ajv({ allErrors: true });
const validateParams = ajv.compile(routesArgumentsSchema);

export const getRpcHandler = (
  methods: Routes
): express.RequestHandler => async (req, res): Promise<void> => {
  try {
    if (typeof req.body !== "object") throw new JsonRpcError("Invalid body");

    // Parse request
    const { method, params }: { method: keyof Routes; params: any[] } =
      req.body || {};
    if (!method) throw new JsonRpcError("No method");
    if (!params) throw new JsonRpcError("No params");
    if (!Array.isArray(params)) throw new JsonRpcError("Invalid params");

    // Get handler
    const handler = methods[method] as (...params: any[]) => Promise<any>;
    if (!handler) throw new JsonRpcError(`Method not found ${method}`);

    // Validate params
    const valid = validateParams({ [method]: params });
    if (!valid)
      throw new JsonRpcError(formatErrors(validateParams.errors, method));

    const result = await handler(...params);
    res.send({ result });
  } catch (e) {
    if (e instanceof JsonRpcError) {
      res.send({ error: { code: e.code, message: e.message } });
    } else {
      // Unexpected error, log and send more details
      const method: string = (req.body || {}).method;
      console.error(method, e);
      res.send({ error: { code: -32603, message: e.message, data: e.stack } });
    }
  }
};

function formatErrors(
  errors: Array<Ajv.ErrorObject> | null | undefined,
  method: string
): string {
  const dataVar = `root_prop`;
  const toReplace = `${dataVar}.${method}`;
  const errorsText = ajv.errorsText(errors, { separator: "\n", dataVar });
  return (
    "Validation error:\n" +
    errorsText.replace(new RegExp(toReplace, "g"), "params")
  );
}

class JsonRpcError extends Error {
  code: number;
  constructor(message?: string, code?: number) {
    super(message);
    this.code = code || -32603;
  }
}
