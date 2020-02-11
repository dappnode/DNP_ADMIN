import React from "react";
import { SetupWizardField } from "types";
import Input from "components/Input";
import InputFieldSelect from "./InputFieldSelect";
import InputFieldFile from "./InputFieldFile";
import SelectMountpoint from "./SelectMountpoint";

export default function InputField({
  field,
  value,
  onValueChange
}: {
  field: SetupWizardField;
  value: string;
  onValueChange: (newValue: string) => void;
}) {
  switch (field.target.type) {
    case "environment":
      if (field.enum)
        return (
          <InputFieldSelect
            value={value}
            options={field.enum}
            onValueChange={onValueChange}
          />
        );
      else
        return (
          <Input
            value={value}
            onValueChange={onValueChange}
            type={field.secret ? "password" : "text"}
          />
        );

    case "portMapping":
      return <Input value={value} onValueChange={onValueChange} />;

    case "fileUpload":
      return (
        <InputFieldFile
          accept={""}
          value={value}
          onValueChange={onValueChange}
        />
      );

    case "namedVolumeMountpoint":
    case "allNamedVolumesMountpoint":
      return (
        <SelectMountpoint
          value={value}
          onValueChange={onValueChange}
        ></SelectMountpoint>
      );

    default:
      return <div>Unknown target type</div>;
  }
}
