import { mapValues } from "lodash";
import deepmerge from "deepmerge";
import {
  SetupSchemaAllDnps,
  UserSettingsAllDnps,
  UserSettings,
  UserSettingTarget
} from "types";
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
  setupSchema: SetupSchemaAllDnps
): UserSettingsAllDnps {
  return mapValues(formData, (formDataDnp, dnpName) => {
    const userSettings: UserSettings = {};
    const schema = setupSchema[dnpName];
    if (!schema || !schema.properties) return {};

    for (const [propId, value] of Object.entries(formDataDnp)) {
      const propSchema = schema.properties[propId];
      // @ts-ignore
      const target: UserSettingTarget | undefined = (propSchema || {}).target;

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
  setupSchema: SetupSchemaAllDnps
): SetupWizardFormDataReturn {
  return mapValues(setupSchema, (dnpSchema, dnpName) => {
    const userSettings = userSettingsAllDnps[dnpName];
    if (!userSettings || !dnpSchema.properties) return {};
    const {
      environment = {},
      portMappings = {},
      namedVolumePaths = {},
      fileUploads = {}
    } = userSettings;
    const formDataDnp: { [propId: string]: string } = {};

    for (const [propId, propSchema] of Object.entries(dnpSchema.properties)) {
      // @ts-ignore
      const target: UserSettingTarget | undefined = (propSchema || {}).target;

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
