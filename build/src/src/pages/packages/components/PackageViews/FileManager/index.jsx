import React, { useState, useEffect } from "react";
import api from "API/rpcMethods";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import To from "./To";
import From from "./From";
import FileExplorer from "./FileExplorer";
// Utils
import { shortName } from "utils/format";
import dataUriToBlob from "utils/dataUriToBlob";
import fileToDataUri from "utils/fileToDataUri";
import parseFileName from "utils/parseFileName";
import { saveAs } from "file-saver";
// style
import "./fileManager.scss";

function FileManager({ dnp }) {
  const id = dnp.name;
  const containerName = dnp.packageName;

  const [path, setPath] = useState("");
  const [filename, setFileName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getWorkingDir() {
      try {
        const workingDir = await api.fileBrowserGetWorkingDir(
          { containerName },
          { toastOnError: true }
        );
        if (workingDir) handlePathChange(workingDir);
        else console.error(`Broken response on getWorkingDir`, workingDir);
      } catch (e) {
        console.error(`Error on getWorkingDir: ${e.stack}`);
      }
    }
    getWorkingDir();
  }, [containerName]);

  async function handlePathChange(newPath) {
    if (newPath === path || !newPath || loading) return;
    if (typeof newPath !== "string")
      return console.error("newPath MUST be a string", newPath);

    try {
      setLoading(true);
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
      const newFileList = await api.fileBrowserLs({
        containerName,
        path: newPath,
        showAll: true
      });
      if (newFileList && Array.isArray(newFileList)) {
        setFileList(newFileList);
        setPath(newPath.trim());
      } else {
        console.error(`Broken response on listFiles`, newFileList);
      }
    } catch (e) {
      console.error(`Error on listFiles: ${e.stack}`);
    } finally {
      setLoading(false);
    }
  }

  async function download(fromPath) {
    try {
      /**
       * [copyFileFrom]
       * Copy file from a DNP and download it on the client
       *
       * @param {string} id DNP .eth name
       * @param {string} fromPath path to copy file from
       * - If path = path to a file: "/usr/src/app/config.json".
       *   Downloads and sends that file
       * - If path = path to a directory: "/usr/src/app".
       *   Downloads all directory contents, tar them and send as a .tar.gz
       * - If path = relative path: "config.json".
       *   Path becomes $WORKDIR/config.json, then downloads and sends that file
       *   Same for relative paths to directories.
       * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
       */
      const dataUri = await api.copyFileFrom(
        { id, fromPath },
        { toastMessage: `Copying file from ${shortName(id)} ${fromPath}...` }
      );
      if (!dataUri) return;

      const blob = dataUriToBlob(dataUri);
      const fileName = parseFileName(fromPath, blob.type);

      saveAs(blob, fileName);
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${fromPath}: ${e.stack}`);
    }
  }

  async function upload(file, toPath) {
    if (!file) return;
    try {
      const name = file.name;
      const dataUri = await fileToDataUri(file);
      /**
       * [copyFileTo]
       * Copy file to a DNP
       *
       * @param {string} id DNP .eth name
       * @param {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
       * @param {string} filename name of the uploaded file.
       * - MUST NOT be a path: "/app", "app/", "app/file.txt"
       * @param {string} toPath path to copy a file to
       * - If path = path to a file: "/usr/src/app/config.json".
       *   Copies the contents of dataUri to that file, overwritting it if necessary
       * - If path = path to a directory: "/usr/src/app".
       *   Copies the contents of dataUri to ${dir}/${filename}
       * - If path = relative path: "config.json".
       *   Path becomes $WORKDIR/config.json, then copies the contents of dataUri there
       *   Same for relative paths to directories.
       */
      await api.copyFileTo(
        { id, dataUri, filename: name, toPath },
        { toastMessage: `Copying file ${name} to ${id} ${toPath}...` }
      );

      // Re-trigger a path change to fetch the file list again and reflect
      // the just uploaded file
      handlePathChange(path + " ");
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${toPath}: ${e.stack}`);
    }
  }

  return (
    <Card>
      <FileExplorer
        {...{
          path,
          fileList,
          loading,
          handlePathChange,
          setFileName,
          download
        }}
      />
      <To {...{ id, path, upload }} />
      <From {...{ path, filename, download }} />
    </Card>
  );
}

FileManager.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired
  }).isRequired
};

export default FileManager;
