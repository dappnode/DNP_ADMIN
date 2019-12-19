import { mapValues, isEmpty, omitBy } from "lodash";
import deepmerge from "deepmerge";
import { UserSettingsAllDnps, UserSettings, SetupTargetAllDnps } from "types";
import { SetupWizardFormDataReturn } from "../types";

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
            if (target.name)
              userSettings.environment = deepmerge(
                userSettings.environment || {},
                { [target.name]: value }
              );
            break;

          case "portMapping":
            if (target.containerPort)
              userSettings.portMappings = deepmerge(
                userSettings.portMappings || {},
                { [target.containerPort]: value }
              );
            break;

          case "namedVolumePath":
            if (target.volumeName)
              userSettings.namedVolumePaths = deepmerge(
                userSettings.namedVolumePaths || {},
                { [target.volumeName]: value }
              );
            break;

          case "fileUpload":
            if (target.path)
              userSettings.fileUploads = deepmerge(
                userSettings.fileUploads || {},
                { [target.path]: value }
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
      namedVolumePaths = {},
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

          case "namedVolumePath":
            const { volumeName } = target;
            if (volumeName && volumeName in namedVolumePaths)
              formDataDnp[propId] = namedVolumePaths[volumeName];
            break;

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

/**
 * Enforces rules on user settings:
 * - namedVolumePaths: must be absolute paths. Renaming for a different named volume is not allowed
 */
export function getUserSettingsDataErrors(
  dataAllDnps: UserSettingsAllDnps
): string[] {
  const errors: string[] = [];
  for (const [dnpName, data] of Object.entries(dataAllDnps)) {
    if (data.namedVolumePaths) {
      for (const [volName, volPath] of Object.entries(data.namedVolumePaths)) {
        /* eslint-disable-next-line no-useless-escape */
        if (volPath && !/^\/[^\/]+/.test(volPath))
          errors.push(
            `volume path for '${dnpName}' '${volName}' must be an absolute path`
          );
      }
    }
  }
  return errors;
}
