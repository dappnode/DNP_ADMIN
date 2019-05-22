import React, { useEffect, useState } from "react";
import api from "API/rpcMethods";
import PropTypes from "prop-types";
// Components
import Button from "components/Button";
import Input from "components/Input";

import {
  FaRegFile as FileIcon,
  FaRegFolder as DirIcon,
  FaArrowLeft as BackIcon
} from "react-icons/fa";

function FileExplorer({ containerName, path, setPath, setFileName }) {
  const [fileList, setFileList] = useState([]);
  const [pathInput, setPathInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /**
     * @returns {array} contents = [{
     *   isDirectory: false,
     *   permissions: "-rwxr-xr-x",
     *   numOfLinks: "2",
     *   ownerName: "root",
     *   ownerGroup: "root",
     *   size: "2745",
     *   month: "May",
     *   day: "9",
     *   time: "20:49",
     *   name: "Eth config.json"
     * }, ... ]
     */
    async function listFiles() {
      if (!path) return;
      try {
        setLoading(true);
        const fileList = await api.fileBrowser(
          { containerName, path, showAll: true },
          { toastOnError: true }
        );
        if (fileList && Array.isArray(fileList)) setFileList(fileList);
        else console.error(`Broken response on listFiles`, fileList);
      } catch (e) {
        console.error(`Error on listFiles: ${e.stack}`);
      } finally {
        setLoading(false);
      }
    }
    listFiles();
  }, [path]);

  function setPathForce(_path) {
    setPath(_path);
    setPathInput(_path);
  }

  function navigateInto(dirName) {
    if (loading) return;
    setPathForce([path.replace(/\/+$/, ""), dirName].join("/"));
  }

  function navigateBack() {
    if (loading) return;
    const parts = path.split("/").filter(part => part);
    if (parts.length > 1) {
      const newPath = parts.slice(0, parts.length - 1).join("/");
      if (path.startsWith("/") && !newPath.startsWith("/"))
        setPathForce("/" + newPath);
      else setPathForce(newPath);
    }
    setPathForce();
    if (parts.length === 1) setPathForce("/");
  }

  return (
    <>
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "1rem"
          }}
          onClick={() => navigateBack()}
        >
          <BackIcon style={{ fontSize: "1.1rem", marginRight: "0.3rem" }} />{" "}
          Back
        </Button>

        <Input
          value={pathInput}
          onValueChange={setPathInput}
          onEnterPress={() => setPath(pathInput)}
          append={
            <Button
              style={{ display: "flex" }}
              onClick={() => setPath(pathInput)}
            >
              Go to
            </Button>
          }
        />
      </div>

      <div
        style={{
          height: "25rem",
          overflowY: "auto",
          border: "var(--border-style)",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">File</th>
              <th scope="col">Size</th>
              <th scope="col">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {fileList.map((file, i) => (
              <tr
                key={i}
                onClick={() => {
                  if (file.isDirectory) navigateInto(file.name);
                  else setFileName(file.name);
                }}
              >
                <th
                  scope="row"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {file.isDirectory ? (
                    <DirIcon
                      style={{ fontSize: "1.1rem", marginRight: "0.8rem" }}
                    />
                  ) : (
                    <FileIcon
                      style={{ fontSize: "1.1rem", marginRight: "0.8rem" }}
                    />
                  )}

                  {file.name}
                </th>
                <td>{file.size}</td>
                <td>
                  {file.month} {file.day} {file.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

FileExplorer.propTypes = {
  containerName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  setPath: PropTypes.func.isRequired
};

export default FileExplorer;
