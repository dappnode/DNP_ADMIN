import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
import Toast from "components/toast/Toast";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Switch from "components/Switch";
import Input from "components/Input";
import Button from "components/Button";
import Terminal from "./Terminal";
// Utils
import { stringIncludes } from "utils/strings";

const refreshInterval = 2 * 1000;
const terminalID = "terminal";

const validateLines = lines => !isNaN(lines) && lines > 0;

function Logs({ id }) {
  // User options
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timestamps, setTimestamps] = useState(false);
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState(200);
  // Fetched data
  const [logs, setLogs] = useState("");
  const [downloading, setDownloading] = useState(false);

  /**
   * This use effect fetches the logs again everytime any of this variables changes:
   * - autoRefresh, timestamps, lines, dnp
   * In case of a fetch error, it will stop the autoRefresh
   * On every first fetch, it will automatically scroll to the bottom
   * On every first fetch, it will display "fetching..."
   */
  useEffect(() => {
    let scrollToBottom = () => {
      const el = document.getElementById(terminalID);
      if (el) el.scrollTop = el.scrollHeight;
      scrollToBottom = () => {};
    };

    async function logDnp() {
      try {
        const options = { timestamps, tail: lines };
        const logs = await api.logPackage({ id, options });
        if (typeof logs !== "string") throw Error("Logs must be a string");
        setLogs(logs);
        // Auto scroll to bottom (deffered after the paint)
        setTimeout(scrollToBottom, 10);
      } catch (e) {
        setLogs(`Error fetching logs: ${e.message}`);
        setAutoRefresh(false);
      }
    }
    if (autoRefresh && validateLines(lines)) {
      setLogs("fetching...");
      const interval = setInterval(logDnp, refreshInterval);
      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRefresh, timestamps, lines, id]);

  async function downloadAll() {
    try {
      setDownloading(true);
      const logs = await api.logPackage({ id, options: { timestamps } });
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(logs);
      var dlAnchorElem = document.getElementById("downloadAnchorElem");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", `DAppNodeLogs-${id}.txt`);
      dlAnchorElem.click();
    } catch (e) {
      console.error(`Error downloading logs: ${e.stack}`);
      Toast({
        message: `Error downloading logs: ${e.message}`,
        success: false,
        hideDetailsButton: true
      });
    } finally {
      setDownloading(false);
    }
  }

  /**
   * Filter the logs text by lines that contain the query
   * If the query is empty, skip the filter
   * If the query returned no matching logs, display custom message
   * If the lines parameter is not valid, display custom message
   */
  const logsArray = (logs || "").split(/\r?\n/);
  let logsFiltered = query
    ? logsArray.filter(line => stringIncludes(line, query)).join("\n")
    : logs;
  if (logs && query && !logsFiltered) logsFiltered = "No match found";

  const terminalText = validateLines(lines)
    ? logsFiltered
    : "Lines must be a number > 0";

  return (
    <>
      <SubTitle>Logs</SubTitle>
      <Card className="log-controls">
        <div>
          <Switch
            checked={autoRefresh}
            onToggle={setAutoRefresh}
            label="Auto-refresh logs"
            id="switch-ar"
          />
          <Switch
            checked={timestamps}
            onToggle={setTimestamps}
            label="Display timestamps"
            id="switch-ts"
          />
        </div>

        <Input
          placeholder="Number of lines to display..."
          value={lines}
          onValueChange={setLines}
          type="number"
          prepend="Lines"
          append={
            <Button disabled={downloading} onClick={downloadAll}>
              Download all
            </Button>
          }
          style={{ minWidth: "75px" }}
        />

        <Input
          placeholder="Filter by..."
          value={query}
          onValueChange={setQuery}
          prepend="Search"
        />

        <Terminal text={terminalText} id={terminalID} />

        <a id="downloadAnchorElem" style={{ display: "none" }} href="/">
          Download Anchor
        </a>
      </Card>
    </>
  );
}

Logs.propTypes = {
  id: PropTypes.string.isRequired
};

export default Logs;
