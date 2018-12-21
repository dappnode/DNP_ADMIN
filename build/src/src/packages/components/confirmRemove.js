import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shortName } from "utils/format";

function shortNameCapitalized(name = "") {
  const _name = shortName(name);
  return _name.charAt(0).toUpperCase() + _name.slice(1);
}

export default function confirmRemove(pkg, removePackage) {
  const name = shortNameCapitalized(pkg.name);
  confirmAlert({
    title: `Removing ${name}`,
    message: `This action cannot be undone. If you do NOT want to keep ${name}'s data remove it permanently with the "Remove DNP + data" option.`,
    buttons: [
      {
        label: "Cancel",
        onClick: () => {}
      },
      {
        label: "Remove",
        onClick: () => removePackage(pkg, false)
      },
      {
        label: "Remove DNP + data",
        onClick: () => removePackage(pkg, true)
      }
    ]
  });
}
