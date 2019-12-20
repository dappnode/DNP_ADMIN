import React from "react";
import { orderBy, isEmpty, mapValues } from "lodash";
// Components
import TableInputs from "components/TableInputs";
import { UserSettingsAllDnps } from "types";
import { shortNameCapitalized } from "utils/format";
import Button from "components/Button";
import deepmerge from "deepmerge";
import "./oldEditor.scss";

interface EditableTableProps {
  headers: string[];
  placeholder: string;
  values?: { [valueId: string]: string };
  disabledValues?: { [valueId: string]: boolean };
  setValue: (valueId: string, value: string) => void;
}

const EditableTable: React.FunctionComponent<EditableTableProps> = ({
  headers,
  placeholder,
  values,
  disabledValues,
  setValue
}) => {
  if (!values || isEmpty(values)) return null;
  const valuesArray = orderBy(
    Object.entries(values).map(([key, value]) => ({ id: key, value })),
    ["id"]
  );
  return (
    <TableInputs
      headers={headers}
      content={valuesArray.map(({ id, value = "" }) => [
        { disabled: true, value: id },
        {
          placeholder,
          value,
          onValueChange: (newValue: string) => setValue(id, newValue),
          disabled: (disabledValues || {})[id]
        }
      ])}
      rowsTemplate=""
    />
  );
};

interface OldEditorProps {
  userSettings: UserSettingsAllDnps;
  initialUserSettings: UserSettingsAllDnps;
  onSubmit: () => void;
  onChange: (newUserSettings: UserSettingsAllDnps) => void;
  onCancel: () => void;
  onHideAdvancedEditor: () => void;
  canBeHidded: boolean;
}

const OldEditor: React.FunctionComponent<OldEditorProps> = ({
  userSettings,
  initialUserSettings,
  onCancel,
  onSubmit,
  onChange,
  onHideAdvancedEditor,
  canBeHidded
}) => {
  function setSettingsMerge(newSetting: UserSettingsAllDnps) {
    onChange(deepmerge(userSettings, newSetting));
  }

  return (
    <>
      {Object.entries(userSettings).map(([dnpName, dnpSettings]) => (
        <React.Fragment key={dnpName}>
          <div className="old-editor-subtitle">
            {shortNameCapitalized(dnpName)}
          </div>
          <EditableTable
            headers={["Env name", "Env value"]}
            placeholder="enter value..."
            values={dnpSettings.environment}
            setValue={(valueId, envValue) =>
              setSettingsMerge({
                [dnpName]: {
                  environment: { [valueId]: envValue }
                }
              })
            }
          />
          <EditableTable
            headers={["Port - container", "Port - host"]}
            placeholder="Ephemeral port if unspecified"
            values={dnpSettings.portMappings}
            setValue={(valueId, hostPort) =>
              setSettingsMerge({
                [dnpName]: {
                  portMappings: { [valueId]: hostPort }
                }
              })
            }
          />
          {/* Rules for volumes
               - Can't be edited if they are already set 
          */}
          <EditableTable
            headers={["Volume name", "Custom mountpoint path"]}
            placeholder="default docker location if unspecified"
            values={dnpSettings.namedVolumeMountpoints}
            disabledValues={mapValues(
              (initialUserSettings[dnpName] || {}).namedVolumeMountpoints || {},
              Boolean
            )}
            setValue={(valueId, mountpointHostPath) =>
              setSettingsMerge({
                [dnpName]: {
                  namedVolumeMountpoints: { [valueId]: mountpointHostPath }
                }
              })
            }
          />
        </React.Fragment>
      ))}

      {/* To match the spacing of FormJsonSchema */}
      <div className="old-editor-actions">
        <div>
          <Button
            style={{ marginRight: "var(--default-spacing)" }}
            onClick={onCancel}
          >
            Back
          </Button>
          <Button variant="dappnode" onClick={() => onSubmit()}>
            Submit
          </Button>
        </div>

        {canBeHidded && (
          <div className="subtle-header" onClick={onHideAdvancedEditor}>
            Hide advanced editor
          </div>
        )}
      </div>
    </>
  );
};

export default OldEditor;
