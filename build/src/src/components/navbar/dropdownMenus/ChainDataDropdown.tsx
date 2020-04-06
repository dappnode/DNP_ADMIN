import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getChainData } from "services/chainData/selectors";
// Icons
import { FiBox } from "react-icons/fi";
import { ChainData } from "types";

function ChainDataDropdown({ chainData }: { chainData: ChainData[] }) {
  if (!Array.isArray(chainData)) {
    console.error("chainData must be an array");
    return null;
  }

  return (
    <BaseDropdown
      name="Chain status"
      messages={chainData.map(
        ({ name, message, error, syncing, progress }) => ({
          title: name,
          body: message,
          isMarkdown: true,
          type: error ? "danger" : syncing ? "warning" : "success",
          progress: progress,
          showProgress: syncing
        })
      )}
      Icon={() => <FiBox size={"1.4em"} />}
      className="chainstatus"
      placeholder="No chains installed"
    />
  );
}

const mapStateToProps = createStructuredSelector({
  chainData: getChainData
});

export default connect(
  mapStateToProps,
  null
)(ChainDataDropdown);
