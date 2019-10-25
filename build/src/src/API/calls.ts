import { wrapRoute } from "./wrapRoute";

import * as routes from "./routes";

export const fetchDnpRequest = wrapRoute<
  routes.fetchDnpRequest.RequestData,
  routes.fetchDnpRequest.ReturnData
>(routes.fetchDnpRequest);
