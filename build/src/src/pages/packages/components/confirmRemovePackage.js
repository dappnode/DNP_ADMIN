import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRemove(id, cb) {
  confirm({
    title: `Removing ${shortNameCapitalized(id)}`,
    text: `This action cannot be undone. If you do NOT want to keep ${id}'s data, remove it permanently clicking the "Remove DNP + data" option.`,
    buttons: [
      { label: "Remove", onClick: () => cb(id, false) },
      { label: "Remove DNP + data", onClick: () => cb(id, true) }
    ]
  });
}
