import { mapValues } from "lodash";
import deepmerge from "deepmerge";
import {
  SetupSchemaAllDnps,
  UserSettingsAllDnps,
  UserSettings,
  UserSettingTarget
} from "types";
import { SetupWizardFormDataReturn } from "../types";

export function formDataToUserSettings(
  formData: SetupWizardFormDataReturn,
  setupSchema: SetupSchemaAllDnps
): UserSettingsAllDnps {
  return mapValues(formData, (formDataDnp, dnpName) => {
    const userSettings: UserSettings = {};
    const schema = setupSchema.properties[dnpName];
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
              userSettings.portMapping = deepmerge(
                userSettings.portMapping || {},
                { [target.containerPort]: value }
              );
            break;
          case "namedVolumePath":
            if (target.volumeName)
              userSettings.namedVolumePath = deepmerge(
                userSettings.namedVolumePath || {},
                { [target.volumeName]: value }
              );
            break;
          case "fileUpload":
            if (target.path)
              userSettings.fileUpload = deepmerge(
                userSettings.fileUpload || {},
                { [target.path]: value }
              );
            break;
        }
    }
    return userSettings;
  });
}

export function userSettingsToFormData(
  userSettingsAllDnps: UserSettingsAllDnps,
  setupSchema: SetupSchemaAllDnps
): SetupWizardFormDataReturn {
  return mapValues(setupSchema.properties, (dnpSchema, dnpName) => {
    const userSettings = userSettingsAllDnps[dnpName];
    if (!userSettings || !dnpSchema.properties) return {};
    const {
      environment = {},
      portMapping = {},
      namedVolumePath = {},
      fileUpload = {}
    } = userSettings;
    const formDataDnp: { [propId: string]: string } = {};
    for (const [propId, propSchema] of Object.entries(dnpSchema.properties)) {
      // @ts-ignore
      const target: UserSettingTarget | undefined = (propSchema || {}).target;
      if (target && target.type) {
        switch (target.type) {
          case "environment":
            if (target.name && target.name in environment)
              formDataDnp[propId] = environment[target.name];
            break;
          case "portMapping":
            if (target.containerPort && target.containerPort in portMapping)
              formDataDnp[propId] = portMapping[target.containerPort];
            break;
          case "namedVolumePath":
            if (target.volumeName && target.volumeName in namedVolumePath)
              formDataDnp[propId] = namedVolumePath[target.volumeName];
            break;
          case "fileUpload":
            if (target.path && target.path in fileUpload)
              formDataDnp[propId] = fileUpload[target.path];
            break;
        }
      }
    }
    return formDataDnp;
  });
}
