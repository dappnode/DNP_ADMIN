import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRestart(id, cb) {
  confirm({
    title: `Restarting ${shortNameCapitalized(id)}`,
    text: `This action cannot be undone. If this DNP holds state, it may be lost.`,
    buttons: [{ label: "Restart", onClick: () => cb(id) }]
  });
}
