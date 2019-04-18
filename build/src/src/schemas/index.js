import Joi from "joi";

const schema = Joi.object({}).pattern(/.*/, Joi.boolean());

window.test2 = value => Joi.assert(value, schema);

// Generic

export const depsObject = Joi.object({}).pattern(/.*/, Joi.string().required());

// Semi-strict manifest check

// export const manifest = Joi.object({
//   name: Joi.string().required(),
//   version: Joi.string().required(),
//   description: Joi.string().allow(""),
//   avatar: Joi.string().allow(""),
//   type: Joi.string(),
//   image: Joi.object({
//     path: Joi.string().required(),
//     hash: Joi.string().required(),
//     size: Joi.number().required(),
//     restart: Joi.string(),
//     ports: Joi.array().items(Joi.string()),
//     volumes: Joi.array().items(Joi.string()),
//     external_vol: Joi.array().items(Joi.string()),
//     environment: Joi.array().items(Joi.string()),
//     ipv4_address: Joi.string(),
//     subnet: Joi.string(),
//     privileged: Joi.boolean(),
//     labels: Joi.array(),
//     cap_add: Joi.string(),
//     cap_drop: Joi.string(),
//     network_mode: Joi.string(),
//     command: Joi.string(),
//     // Some are wrong
//     keywords: Joi.array().items(Joi.string()),
//     // #### Backwards compatibility
//     name: Joi.string(), // #### Backwards compatibility
//     version: Joi.string() // #### Backwards compatibility
//   }).required(),
//   dependencies: Joi.object(),
//   chain: Joi.string(),
//   changelog: Joi.string(),
//   warnings: Joi.object(),
//   origin: Joi.string(),
//   // Metadata
//   author: Joi.string(),
//   contributors: Joi.array().items(Joi.string()),
//   keywords: Joi.array().items(Joi.string()),
//   homepage: Joi.object(),
//   repository: Joi.object(),
//   bugs: Joi.object(),
//   license: Joi.string().allow("")
// });

// Minimal (very relaxed) manifest check
export const manifest = Joi.object({
  name: Joi.string().required(),
  version: Joi.string().required(),
  image: Joi.object({
    path: Joi.string().required()
  })
    .pattern(/./, Joi.any())
    .required()
}).pattern(/./, Joi.any());

export const alertType = Joi.string().valid("danger", "warning", "success");

// Service > chainData

export const chainData = Joi.array()
  .items(
    Joi.object({
      name: Joi.string().required(),
      message: Joi.string().required(),
      syncing: Joi.boolean(),
      progress: Joi.number(),
      error: Joi.boolean()
    })
  )
  .required();

// Service > dappnodeStatus

export const params = Joi.object({
  ip: Joi.string(),
  name: Joi.string(),
  staticIp: Joi.string().allow("", null),
  domain: Joi.string(),
  upnpAvailable: Joi.boolean().required(),
  noNatLoopback: Joi.boolean().required(),
  alertToOpenPorts: Joi.boolean().required(),
  internalIp: Joi.string().required()
}).required();

export const stats = Joi.object({
  cpu: Joi.string(),
  memory: Joi.string(),
  disk: Joi.string()
}).required();

export const diagnose = Joi.object({
  name: Joi.string().required(),
  result: Joi.string(),
  error: Joi.string()
}).or("result", "error");

// const pingReturns

export const versionData = Joi.object({
  version: Joi.string().required(),
  branch: Joi.string().required(),
  commit: Joi.string().required()
});

// const ipfsConnectionStatus

// Service > devices

export const device = Joi.object({
  id: Joi.string().required(),
  admin: Joi.boolean().required(),
  ip: Joi.string().allow(""),
  url: Joi.string()
}).required();

export const devices = Joi.array()
  .items(device)
  .required();

// Service > dnpDirectory

export const dnpDirectoryItem = Joi.object({
  name: Joi.string().required(),
  status: Joi.string(),
  directoryId: Joi.number(),
  manifest: manifest,
  avatar: Joi.string().dataUri()
});
export const dnpDirectory = Joi.array().items(dnpDirectoryItem);

// Service > dnpInstalled

export const dnpInstalledItem = Joi.object({
  id: Joi.string().required(),
  packageName: Joi.string().required(),
  version: Joi.string().required(),
  isDnp: Joi.boolean().required(),
  isCore: Joi.boolean().required(),
  created: Joi.string().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  shortName: Joi.string(), // ###### TODO: remove
  ports: Joi.array().required(),
  volumes: Joi.array().required(),
  state: Joi.string().required(),
  running: Joi.boolean().required(),
  // From labels
  origin: Joi.string(),
  chain: Joi.string(),
  dependencies: Joi.object(),
  portsToClose: Joi.array(),
  // Appended later
  envs: Joi.object(),
  manifest: Joi.object() // #### Don't check this manifest at all
});

export const dnpInstalled = Joi.array()
  .items(dnpInstalledItem)
  .required();

// Service > isInstallingLogs

// Service > loadingStatus

// Service > notifications

export const notification = Joi.object({
  id: Joi.string().required(),
  type: alertType.required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  timestamp: Joi.number()
});

// Service > userActionLogs

export const userActionLog = Joi.object({
  level: Joi.string().required(),
  event: Joi.string().required(),
  message: Joi.string().required(),
  timestamp: Joi.string().required(),
  kwargs: Joi.object().required(),
  result: Joi.any(),
  stack: Joi.string(),
  name: Joi.string() // #### Backwards compatibility
});
