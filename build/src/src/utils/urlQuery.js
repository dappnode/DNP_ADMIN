import pipe from "utils/pipe";

const objToParams = obj =>
  Object.keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join("&");

const paramsToObj = params =>
  params.split("&").reduce((obj, pair) => {
    const [key, value] = pair.split("=");
    obj[key] = decodeURIComponent(value);
    return obj;
  }, {});

// timeapp.public.dappnode.eth
// 0.1.16
// /ipfs/QmSDgpiHco5yXdyVTfhKxr3aiJ82ynz8V14QcGKicM3rVh

export const parseUrlQuery = pipe(paramsToObj);

export const stringifyUrlQuery = pipe(objToParams);
