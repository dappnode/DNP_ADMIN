import Joi from "joi";

// Generic

export const depsObject = Joi.object({}).pattern(/.*/, Joi.string().required());

// Minimal (very relaxed) manifest check
export const manifest = Joi.object({
  name: Joi.string().required(),
  version: Joi.string().required()
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
    }).pattern(/./, Joi.any())
  )
  .required();

// Service > dappnodeStatus

export const params = Joi.object({
  ip: Joi.string().allow(""),
  name: Joi.string().allow(""),
  staticIp: Joi.string().allow("", null),
  domain: Joi.string().allow(""),
  upnpAvailable: Joi.boolean().required(),
  noNatLoopback: Joi.boolean().required(),
  alertToOpenPorts: Joi.boolean().required(),
  internalIp: Joi.string().allow("")
})
  .pattern(/./, Joi.any())
  .required();

export const stats = Joi.object({
  cpu: Joi.string(),
  memory: Joi.string(),
  disk: Joi.string()
})
  .pattern(/./, Joi.any())
  .required();

export const diagnose = Joi.object({
  name: Joi.string().required(),
  result: Joi.string(),
  error: Joi.string()
}).or("result", "error");

// const pingReturns

export const versionData = Joi.object({
  version: Joi.string(),
  branch: Joi.string(),
  commit: Joi.string()
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
  status: Joi.number(),
  statusName: Joi.string(),
  position: Joi.number(),
  directoryId: Joi.number(),
  isFeatured: Joi.bool(),
  featuredIndex: Joi.number(),
  manifest: manifest,
  avatar: Joi.string().dataUri()
}).pattern(/./, Joi.any());
export const dnpDirectory = Joi.array().items(dnpDirectoryItem);

// Service > dnpInstalled

export const dnpInstalledItem = Joi.object({
  id: Joi.string().required(),
  packageName: Joi.string().required(),
  version: Joi.string().required(),
  isDnp: Joi.boolean().required(),
  isCore: Joi.boolean().required(),
  created: [Joi.number(), Joi.string()],
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
}).pattern(/./, Joi.any());

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
}).pattern(/./, Joi.any());

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
}).pattern(/./, Joi.any());
