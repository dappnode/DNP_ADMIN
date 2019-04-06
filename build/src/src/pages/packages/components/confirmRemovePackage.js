import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRemove(id, cb) {
  confirmAlert({
    title: `Removing ${shortNameCapitalized(id)}`,
    message: `This action cannot be undone. If you do NOT want to keep ${id}'s data, remove it permanently clicking the "Remove DNP + data" option.`,
    buttons: [
      { label: "Cancel", onClick: () => {} },
      { label: "Remove", onClick: () => cb(id, false) },
      { label: "Remove DNP + data", onClick: () => cb(id, true) }
    ]
  });
}
