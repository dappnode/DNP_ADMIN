import React from "react";
import { connect } from "react-redux";
import * as a from "../../../actions";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Button from "components/Button";

function DappmanagerDnpDappnodeEth({ cleanCache }) {
  return (
    <>
      <SubTitle>Clean cache</SubTitle>
      <Card>
        <div className="help-text" style={{ marginBottom: "1rem" }}>
          Remove the local cache of Aragon Package Manager (APM) entries,
          manifests, avatars. Also remove the user action logs shown in the
          Activity tab.
        </div>

        <Button onClick={cleanCache}>Clean cache</Button>
      </Card>
    </>
  );
}

const mapDispatchToProps = {
  cleanCache: a.cleanCache
};

// withLoading is applied at DevicesRoot
export default connect(
  null,
  mapDispatchToProps
)(DappmanagerDnpDappnodeEth);
