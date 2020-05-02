import { RootState } from "rootReducer";
import { coreName } from "params";
// Selectors
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { DependencyListItem, ManifestUpdateAlert } from "types";

// Service > coreUpdate

export const getCoreUpdateData = (state: RootState) =>
  state.coreUpdate.coreUpdateData;
export const getUpdatingCore = (state: RootState) =>
  state.coreUpdate.updatingCore;

/**
 * Returns core dependencies,
 * unless the core package is the only one, them returns it
 */
export const getCoreDeps = (state: RootState): DependencyListItem[] => {
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
export const getCoreChangelog = (state: RootState): string | undefined => {
  const coreUpdateData = getCoreUpdateData(state);
  if (!coreUpdateData) return undefined;
  return coreUpdateData.changelog;
};

/**
 * Gets the core update message, computing the current update jump
 */
export const getCoreUpdateAlerts = (
  state: RootState
): ManifestUpdateAlert[] => {
  const coreUpdateData = getCoreUpdateData(state);
  return (coreUpdateData || {}).updateAlerts || [];
};

/**
 * Gets the core current version
 */
export const getCoreCurrentVersion = (state: RootState): string | undefined => {
  const dnpInstalled = getDnpInstalled(state);
  const dnpCore = dnpInstalled.find(dnp => dnp.name === coreName);
  return (dnpCore || {}).version;
};

export const getCoreUpdateAvailable = (state: RootState): boolean => {
  const coreUpdateData = getCoreUpdateData(state);
  return Boolean(coreUpdateData && coreUpdateData.available);
};

export const getIsCoreUpdateTypePatch = (state: RootState): boolean => {
  const coreUpdateData = getCoreUpdateData(state);
  return Boolean(coreUpdateData && coreUpdateData.type === "patch");
};
