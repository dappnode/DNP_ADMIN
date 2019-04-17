import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { getUserActionLogs } from "services/userActionLogs/selectors";
// Own module
import ActivityList from "./ActivityList";
import { title } from "../data";
import "./activity.css";
// Components
import Title from "components/Title";

function Activity({ userActionLogs }) {
  function download() {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(userActionLogs, null, 2));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "DAppNodeLogs.json");
    dlAnchorElem.click();
  }

  return (
    <>
      <Title title={title} />

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
