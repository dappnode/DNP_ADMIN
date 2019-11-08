import { DirectoryItem, PackageContainer } from "../types";

export const route = "listPackages.dappmanager.dnp.dappnode.eth";

// No request arguments
export type RequestData = {};

export type ReturnData = PackageContainer[];

export const returnDataSchema = {
  type: "array",
  title: "directory",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      version: { type: "string" }
    },
    required: ["name", "version"]
  }
};

// Samples for testing

export const returnDataSample: ReturnData = [
  {
    id: "83f",
    packageName: "DAppNodePackage-name",
    version: "0.2.0",
    isDnp: true,
    isCore: false,
    created: 1527181273,
    image: "name:0.2.0",
    name: "name",
    shortName: "name",
    state: "running",
    running: true,
    chain: "ethereum",
    dependencies: {},
    envs: {},
    ports: [],
    volumes: [],
    defaultEnvironment: {},
    defaultPorts: [],
    defaultVolumes: []
  }
];
