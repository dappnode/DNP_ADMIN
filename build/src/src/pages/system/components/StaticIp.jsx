import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as a from "../actions";
import isIpv4 from "utils/isIpv4";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Input from "components/Input";
import { ButtonLight, ButtonDanger } from "components/Button";
// External
import { getStaticIp } from "services/dappnodeStatus/selectors";

function StaticIp({ staticIp = "", setStaticIp }) {
  const [input, setInput] = useState(staticIp);

  useEffect(() => {
    setInput(staticIp);
  }, [staticIp]);

  const update = () => {
    if (isIpv4(input)) setStaticIp(input);
  };

  return (
    <>
      <SubTitle>Static IP</SubTitle>
      <Card>
        <div className="input-group">
          <Input
            placeholder="Your static ip..."
            value={input}
            onValueChange={setInput}
            onEnterPress={update}
            append={
              <>
                <ButtonLight disabled={!isIpv4(input)} onClick={update}>
                  {staticIp ? "Update" : "Enable"}
                </ButtonLight>
                {staticIp && (
                  <ButtonDanger onClick={() => setStaticIp("")}>
                    Disable
                  </ButtonDanger>
                )}
              </>
            }
          />
        </div>
      </Card>
    </>
  );
}

StaticIp.propTypes = {
  staticIp: PropTypes.string.isRequired,
  setStaticIp: PropTypes.func.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  staticIp: getStaticIp
});

const mapDispatchToProps = {
  setStaticIp: a.setStaticIp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticIp);
