import { PackageReleaseMetadata } from "types-dappmanager";
import { UiSchema } from "react-jsonschema-form";
import { JSONSchema6 } from "json-schema";

// Setup schema types
export type SetupSchema = JSONSchema6;
export type SetupUiSchema = UiSchema;

/**
 * [NOTE] Items MUST be ordered by the directory order
 * - featured #0
 * - featured #1
 * - whitelisted #0
 * - whitelisted #1
 * - whitelisted #2
 * - other #0
 * - other #1
 *
 * [NOTE] Search result will never show up in the directory listing,
 * they will appear in a future dropdown under the searchbar
 */
export interface DirectoryItem {
  name: string;
  description: string; // = metadata.shortDescription || metadata.description
  avatar: string; // Must be URL to a resource in a DAPPMANAGER API
  isInstalled: boolean; // Show "UPDATE"
  isUpdated: boolean; // Show "UPDATED"
  whitelisted: boolean;
  isFeatured: boolean;
  featuredStyle?: {
    featuredBackground?: string;
    featuredColor?: string;
    featuredAvatarFilter?: string;
  };
  categories: string[];
}

export interface RequestStatus {
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export interface SetupSchemaAllDnps {
  [dnpName: string]: SetupSchema;
}

export interface SetupSchemaAllDnpsFormated {
  type: "object";
  properties: { [dnpName: string]: SetupSchema };
}

export interface SetupUiSchemaAllDnps {
  [dnpName: string]: SetupUiSchema;
}

export type UserSettingTarget =
  | { type: "environment"; name: string }
  | { type: "portMapping"; containerPort: string }
  | { type: "namedVolumePath"; volumeName: string }
  | { type: "fileUpload"; path: string };

// Settings must include the previous user settings

export interface UserSettings {
  environment?: { [envName: string]: string };
  portMapping?: { [containerPortAndType: string]: string };
  namedVolumePath?: { [volumeName: string]: string };
  fileUpload?: { [containerPath: string]: string };
}
// "bitcoin.dnp.dappnode.eth": {
//   environment: { MODE: "VALUE_SET_BEFORE" }
//   portMappings: { "8443": "8443"; "8443/udp": "8443" },
//   namedVolumePaths: { data: "" }
//   fileUploads: { "/usr/src/app/config.json": "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D" }
// };
export interface UserSettingsAllDnps {
  [dnpName: string]: UserSettings;
}

export interface RequestedDnp {
  name: string; // "bitcoin.dnp.dappnode.eth"
  version: string; // "0.2.5", "/ipfs/Qm"
  origin: string | null; // "/ipfs/Qm"
  avatar: string; // "http://dappmanager.dappnode/avatar/Qm7763518d4";
  metadata: PackageReleaseMetadata;
  // Setup wizard
  setupSchema?: SetupSchemaAllDnps;
  setupUiSchema?: SetupUiSchemaAllDnps;
  // Additional data
  imageSize: number;
  isUpdated: boolean;
  isInstalled: boolean;
  // Settings must include the previous user settings
  settings: UserSettingsAllDnps;
  request: {
    compatible: {
      requiresCoreUpdate: boolean;
      resolving: boolean;
      isCompatible: boolean; // false;
      error: string; // "LN requires incompatible dependency";
      dnps: {
        [dnpName: string]: { from: string | null; to: string };
        // "bitcoin.dnp.dappnode.eth": { from: "0.2.5"; to: "0.2.6" };
        // "ln.dnp.dappnode.eth": { from: null; to: "0.2.2" };
      };
    };
    available: {
      isAvailable: boolean; // false;
      message: string; // "LN image not available";
    };
  };
}

// Installing types

export interface ProgressLogs {
  [dnpName: string]: string;
}

export interface ProgressLogsByDnp {
  [dnpName: string]: ProgressLogs;
}
