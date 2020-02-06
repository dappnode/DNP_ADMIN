import { mapValues, isEmpty, omitBy } from "lodash";
import deepmerge from "deepmerge";
import { UserSettingsAllDnps, UserSettings, SetupTargetAllDnps } from "types";
import { SetupWizardFormDataReturn } from "../types";
import {
  MOUNTPOINT_DEVICE_LEGACY_TAG,
  USER_SETTING_DISABLE_TAG
} from "../../../params";

/**
 * Iterate the formData and find if there's a definition for that property
 * in the setupSchema. If so, use the target to add the setting in the correct
 * property of userSettings
 *
 * @param formData
 * @param setupSchema
 * @return userSettings
 */
export function formDataToUserSettings(
  formData: SetupWizardFormDataReturn,
  setupTarget: SetupTargetAllDnps
): UserSettingsAllDnps {
  return mapValues(formData, (formDataDnp, dnpName) => {
    const userSettings: UserSettings = {};
    const targets = setupTarget[dnpName];
    if (!targets) return {};

    for (const [propId, value] of Object.entries(formDataDnp)) {
      const target = targets[propId];
      if (target && target.type)
        switch (target.type) {
          case "environment":
            const envValue = value;
            if (target.name)
              userSettings.environment = deepmerge(
                userSettings.environment || {},
                { [target.name]: envValue }
              );
            break;

          case "portMapping":
            const hostPort = value;
            if (target.containerPort)
              userSettings.portMappings = deepmerge(
                userSettings.portMappings || {},
                { [target.containerPort]: hostPort }
              );
            break;

          case "namedVolumeMountpoint": {
            const mountpointHostPath = value;
            if (target.volumeName)
              userSettings.namedVolumeMountpoints = deepmerge(
                userSettings.namedVolumeMountpoints || {},
                { [target.volumeName]: mountpointHostPath }
              );
            break;
          }

          case "allNamedVolumesMountpoint": {
            const mountpointHostPath = value;
            userSettings.allNamedVolumeMountpoint = mountpointHostPath;
            break;
          }

          case "fileUpload":
            const fileDataUrl = value;
            if (target.path)
              userSettings.fileUploads = deepmerge(
                userSettings.fileUploads || {},
                { [target.path]: fileDataUrl }
              );
            break;
        }
    }
    return userSettings;
  });
}

/**
 * For each property defined in the setup schema, check if there is
 * a corresponding user setting (by looking at its target), and if so,
 * append it to the formData object
 *
 * @param userSettingsAllDnps
 * @param setupSchema
 * @return formData
 */
export function userSettingsToFormData(
  userSettingsAllDnps: UserSettingsAllDnps,
  setupTarget: SetupTargetAllDnps
): SetupWizardFormDataReturn {
  return mapValues(setupTarget, (targets, dnpName) => {
    const userSettings = userSettingsAllDnps[dnpName];
    if (!userSettings || !targets) return {};
    const {
      environment = {},
      portMappings = {},
      namedVolumeMountpoints = {},
      allNamedVolumeMountpoint = "",
      fileUploads = {}
    } = userSettings;
    const formDataDnp: { [propId: string]: string } = {};

    for (const [propId, target] of Object.entries(targets)) {
      if (target && target.type) {
        switch (target.type) {
          case "environment":
            const { name } = target;
            if (name && name in environment)
              formDataDnp[propId] = environment[name];
            break;

          case "portMapping":
            const { containerPort } = target;
            if (containerPort && containerPort in portMappings)
              formDataDnp[propId] = portMappings[containerPort];
            break;

          case "namedVolumeMountpoint": {
            const { volumeName } = target;
            if (volumeName && volumeName in namedVolumeMountpoints)
              formDataDnp[propId] = namedVolumeMountpoints[volumeName];
            break;
          }

          case "allNamedVolumesMountpoint": {
            formDataDnp[propId] = allNamedVolumeMountpoint;
            break;
          }

          case "fileUpload":
            const { path } = target;
            if (path && path in fileUploads)
              formDataDnp[propId] = fileUploads[path];
            break;
        }
      }
    }
    return formDataDnp;
  });
}

/**
 * Removes empty keys to prevent react-json-schema-form to start validating
 * empty fields before the user starts typing, resulting in bad UX
 * @param formData
 */
export function cleanInitialFormData(
  formData: SetupWizardFormDataReturn
): SetupWizardFormDataReturn | undefined {
  const _obj = omitBy(
    mapValues(formData, formDataDnp =>
      omitBy(formDataDnp, value => typeof value === "string" && !value)
    ),
    isEmpty
  );
  return isEmpty(_obj) ? undefined : _obj;
}

/* eslint-disable-next-line no-useless-escape */
const isAbsolute = (path: string) => /^\/[^\/]+/.test(path);

/**
 * Enforces rules on user settings:
 * - namedVolumeMountpoints: must be absolute paths. Renaming for a different named volume is not allowed
 */
export function getUserSettingsDataErrors(
  dataAllDnps: UserSettingsAllDnps
): string[] {
  const errors: string[] = [];
  for (const [dnpName, data] of Object.entries(dataAllDnps)) {
    if (data.namedVolumeMountpoints) {
      for (const [volName, volPath] of Object.entries(
        data.namedVolumeMountpoints
      )) {
        if (
          volPath &&
          !(
            isAbsolute(volPath) ||
            volPath.startsWith(MOUNTPOINT_DEVICE_LEGACY_TAG) ||
            volPath.startsWith(USER_SETTING_DISABLE_TAG)
          )
        )
          errors.push(
            `Mountpoint path for '${dnpName}' '${volName}' must be an absolute path`
          );
      }
    }
  }
  return errors;
}
