import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import ActivityList from "./ActivityList";
import { getUserActionLogs } from "services/userActionLogs/selectors";

import "./activity.css";

function Activity({ userActionLogs }) {
  function download() {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.props.userActionLogs, null, 2));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "DAppNodeLogs.json");
    dlAnchorElem.click();
  }

  return (
    <>
      <div className="section-title">Activity</div>

      <p>
        If a developer asks for more information regarding an error; please find
        the error in the list below, tap on it and copy everything in the
        expanded grey text area.
      </p>
      <button className="btn btn-dappnode mb-4" onClick={download}>
        Download all logs
      </button>
      <a id="downloadAnchorElem" style={{ display: "none" }} href="/">
        Download Anchor
      </a>
      <ActivityList userActionLogs={userActionLogs} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  userActionLogs: getUserActionLogs
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);
