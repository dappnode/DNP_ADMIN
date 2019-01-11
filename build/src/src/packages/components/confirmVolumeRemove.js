import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shortName } from "utils/format";

function shortNameCapitalized(name = "") {
  const _name = shortName(name);
  return _name.charAt(0).toUpperCase() + _name.slice(1);
}

export default function confirmRemove(id, removeVolumesAction) {
  const name = shortNameCapitalized(id);
  confirmAlert({
    title: `Removing ${name} data`,
    message: `This action cannot be undone. If this DNP is a blockchain, it will lose all the chain data and start syncing from scratch.`,
    buttons: [
      {
        label: "Cancel",
        onClick: () => {}
      },
      {
        label: "Remove volumes",
        onClick: () => removeVolumesAction(id)
      }
    ]
  });
}
