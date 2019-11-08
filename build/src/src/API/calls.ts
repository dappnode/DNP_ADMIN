import { wrapRoute } from "./wrapRoute";

import * as _fetchDirectory from "../route-types/fetchDirectory";
import * as _fetchDnpRequest from "../route-types/fetchDnpRequest";
import * as _installPackage from "../route-types/installPackage";
import * as _listPackages from "../route-types/listPackages";

export const fetchDirectory = wrapRoute<
  _fetchDirectory.RequestData,
  _fetchDirectory.ReturnData
>(_fetchDirectory);

export const fetchDnpRequest = wrapRoute<
  _fetchDnpRequest.RequestData,
  _fetchDnpRequest.ReturnData
>(_fetchDnpRequest);

export const installPackage = wrapRoute<
  _installPackage.RequestData,
  _installPackage.ReturnData
>(_installPackage);

export const listPackages = wrapRoute<
  _listPackages.RequestData,
  _listPackages.ReturnData
>(_listPackages);
