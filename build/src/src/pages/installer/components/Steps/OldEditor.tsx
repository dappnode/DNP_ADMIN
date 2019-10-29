import React from "react";
import { orderBy, isEmpty } from "lodash";
import styled from "styled-components";
// Components
import TableInputs from "components/TableInputs";
import { UserSettingsAllDnps } from "types";
import { shortNameCapitalized } from "utils/format";
import Button from "components/Button";
import deepmerge from "deepmerge";
import "./oldEditor.scss";

const DnpSubtitle = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  line-height: inherit;
  color: inherit;
  white-space: normal;
`;

interface StringValues {
  [valueId: string]: string;
}

interface EditableTableProps {
  headers: string[];
  placeholder: string;
  values?: StringValues;
  setValue: (valueId: string, value: string) => void;
}

const EditableTable: React.FunctionComponent<EditableTableProps> = ({
  headers,
  placeholder,
  values,
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
          onValueChange: (newValue: string) => setValue(id, newValue)
        }
      ])}
      rowsTemplate=""
    />
  );
};

interface OldEditorProps {
  userSettings: UserSettingsAllDnps;
  onSubmit: () => void;
  onChange: (newUserSettings: UserSettingsAllDnps) => void;
  onCancel: () => void;
  onHideAdvancedEditor: () => void;
  canBeHidded: boolean;
}

const OldEditor: React.FunctionComponent<OldEditorProps> = ({
  userSettings,
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
          <DnpSubtitle>{shortNameCapitalized(dnpName)}</DnpSubtitle>
          <EditableTable
            headers={["Env name", "Env value"]}
            placeholder="enter value..."
            values={dnpSettings.environment}
            setValue={(valueId, value) =>
              setSettingsMerge({
                [dnpName]: {
                  environment: { [valueId]: value }
                }
              })
            }
          />
          <EditableTable
            headers={["Port - container", "Port - host"]}
            placeholder="Ephemeral port if unspecified"
            values={dnpSettings.portMapping}
            setValue={(valueId, value) =>
              setSettingsMerge({
                [dnpName]: {
                  portMapping: { [valueId]: value }
                }
              })
            }
          />
          <EditableTable
            headers={["Volume name", "Custom path"]}
            placeholder="default docker location if unspecified"
            values={dnpSettings.namedVolumePath}
            setValue={(valueId, value) =>
              setSettingsMerge({
                [dnpName]: {
                  namedVolumePath: { [valueId]: value }
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
