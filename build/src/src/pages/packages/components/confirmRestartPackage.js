import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRestart(id, cb) {
  confirmAlert({
    title: `Removing ${shortNameCapitalized(id)}`,
    message: `This action cannot be undone. If this DNP holds state, it may be lost.`,
    buttons: [
      { label: "Cancel", onClick: () => {} },
      { label: "Restart", onClick: () => cb(id) }
    ]
  });
}
