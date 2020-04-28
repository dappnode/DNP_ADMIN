import React, { useState, useEffect } from "react";
import { api } from "API/start";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import isIpv4 from "utils/isIpv4";
import { withToast } from "components/toast/Toast";
// Components
import Card from "components/Card";
import Input from "components/Input";
import Button from "components/Button";
// External
import { getStaticIp } from "services/dappnodeStatus/selectors";

function StaticIp({ staticIp = "" }) {
  const [input, setInput] = useState(staticIp);

  useEffect(() => {
    setInput(staticIp);
  }, [staticIp]);

  async function updateStaticIp(newStaticIp: string) {
    if (isIpv4(newStaticIp))
      try {
        await withToast(() => api.setStaticIp({ staticIp: newStaticIp }), {
          message: "Setting static ip...",
          onSuccess: "Set static ip"
        });
      } catch (e) {
        console.error("Error on setStaticIp", e);
      }
  }

  return (
    <Card spacing>
      <div>
        You can set a static IP for this DAppNode instead of using a dyndns.
        Only set a static IP if you are sure it is static, otherwise you may not
        be able to connect to its VPN.
      </div>

      <div className="input-group">
        <Input
          placeholder="Your static ip..."
          value={input}
          onValueChange={setInput}
          onEnterPress={() => updateStaticIp(input)}
          append={
            <>
              <Button
                variant="dappnode"
                disabled={!isIpv4(input)}
                onClick={() => updateStaticIp(input)}
              >
                {staticIp ? "Update" : "Enable"}
              </Button>
              {staticIp && (
                <Button
                  variant="outline-dappnode"
                  onClick={() => updateStaticIp("")}
                >
                  Disable
                </Button>
              )}
            </>
          }
        />
      </div>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  staticIp: getStaticIp
});

export default connect(
  mapStateToProps,
  null
)(StaticIp);
