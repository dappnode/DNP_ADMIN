import React from "react";
import api from "API/rpcMethods";
import { confirm } from "components/ConfirmDialog";

// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Columns from "components/Columns";
import Button from "components/Button";

function RebootHost() {
  function reboot() {
    confirm({
      title: `Rebooting host`,
      text: `Are you sure you want to reboot the host? Only do this action if it's stricly necessary.`,
      label: "Reboot",
      onClick: () => api.rebootHost({}, { toastMessage: `Rebooting host...` }),
      variant: "danger"
    });
  }

  async function shutdown() {
    // Since there are two consecutive modals, the async form must be used
    await new Promise(resolve =>
      confirm({
        title: `Shuting down host`,
        text: `WARNING! You will not be able to turn back on your DAppNode from the admin UI, you will have to manually (or physically) start it again. Only do this action if it's stricly necessary, or you know what you are doing.`,
        label: "Shutdown",
        onClick: resolve,
        variant: "danger"
      })
    );

    await new Promise(resolve =>
      confirm({
        title: `Are you sure?`,
        text: `You will not be able to turn back on your DAppNode from the admin UI.`,
        label: "I am sure, shutdown",
        onClick: resolve,
        variant: "danger"
      })
    );

    await api.poweroffHost({}, { toastMessage: `Shutting down host...` });
  }

  return (
    <>
      <SubTitle>Reboot host</SubTitle>
      <Card className="backup">
        {/* Get backup */}
        <Columns>
          <div>
            <div className="subtle-header">REBOOT HOST</div>
            <p>
              Only use this functionality if it's stricly necessary and the last
              resource to solve a problem.
            </p>
            <Button
              onClick={reboot}
              // disabled={isOnProgress}
              variant="outline-danger"
            >
              Reboot
            </Button>
          </div>

          {/* Restore backup */}
          <div>
            <div className="subtle-header">SHUTDOWN HOST</div>
            <p>
              You will not be able to start your DAppNode from the admin UI, you
              will have to do it manually.
            </p>
            <Button
              onClick={shutdown}
              // disabled={isOnProgress}
              variant="outline-danger"
            >
              Shutdown
            </Button>
          </div>
        </Columns>
      </Card>
    </>
  );
}

export default RebootHost;
