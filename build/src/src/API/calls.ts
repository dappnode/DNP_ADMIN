import { wrapRoute } from "./wrapRoute";

import * as _fetchDnpRequest from "./routes/fetchDnpRequest";
import * as _installPackage from "./routes/installPackage";

export const fetchDnpRequest = wrapRoute<
  _fetchDnpRequest.RequestData,
  _fetchDnpRequest.ReturnData
>(_fetchDnpRequest);

export const installPackage = wrapRoute<
  _installPackage.RequestData,
  _installPackage.ReturnData
>(_installPackage);
