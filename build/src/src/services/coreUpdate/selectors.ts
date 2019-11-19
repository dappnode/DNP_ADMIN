import { mountPoint, coreName } from "./data";
// Selectors
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { CoreUpdateState } from "./types";
import { DependencyListItem, ManifestUpdateAlert } from "types";

// Service > coreUpdate

const getLocal = (state: any): CoreUpdateState => state[mountPoint];

export const getCoreUpdateData = (state: any) => getLocal(state).coreUpdateData;
export const getUpdatingCore = (state: any) => getLocal(state).updatingCore;

/**
 * Returns core dependencies,
 * unless the core package is the only one, them returns it
 */
export const getCoreDeps = (state: any): DependencyListItem[] => {
  const coreUpdateData = getCoreUpdateData(state);
  if (!coreUpdateData) return [];

  const corePackages = coreUpdateData.packages || [];
  const coreDeps = corePackages.filter(
    dnp => !(dnp.name || "").includes("core")
  );
  if (coreDeps.length) return coreDeps;

  const coreDnp = corePackages.find(dnp => (dnp.name || "").includes("core"));
  if (coreDnp) {
    // #### TODO: to prevent show the legacy OpenVPN 0.2.0 warning alert
    // remove the warning on install for the core.dnp.dappnode.eth DNP
    // Alerts can be added via the conditional update alerts
    coreDnp.warningOnInstall = "";
    return [coreDnp];
  }

  return [];
};

/**
 * Appends property `updateType` to the manifest
 * updateType = "major, minor, patch"
 */
export const getCoreChangelog = (state: any): string | undefined => {
  const coreUpdateData = getCoreUpdateData(state);
  if (!coreUpdateData) return undefined;
  return coreUpdateData.changelog;
};

/**
 * Gets the core update message, computing the current update jump
 */
export const getCoreUpdateAlerts = (state: any): ManifestUpdateAlert[] => {
  const coreUpdateData = getCoreUpdateData(state);
  return (coreUpdateData || {}).updateAlerts || [];
};

/**
 * Gets the core current version
 */
export const getCoreCurrentVersion = (state: any): string | undefined => {
  const dnpInstalled = getDnpInstalled(state);
  const dnpCore = dnpInstalled.find(dnp => dnp.name === coreName);
  return (dnpCore || {}).version;
};

export const getCoreUpdateAvailable = (state: any): boolean => {
  const coreUpdateData = getCoreUpdateData(state);
  return Boolean(coreUpdateData && coreUpdateData.available);
};

export const getIsCoreUpdateTypePatch = (state: any): boolean => {
  const coreUpdateData = getCoreUpdateData(state);
  return Boolean(coreUpdateData && coreUpdateData.type === "patch");
};
