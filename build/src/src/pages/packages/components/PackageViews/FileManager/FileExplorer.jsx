import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import pathUtils from "path";
import humanFileSize from "utils/humanFileSize";
// Components
import Button from "components/Button";
import Input from "components/Input";

import {
  FaRegFile as FileIcon,
  FaRegFolder as DirIcon,
  FaArrowLeft as BackIcon
} from "react-icons/fa";
import { MdFileDownload as DownloadIcon } from "react-icons/md";

function FileExplorer({
  path,
  fileList,
  loading,
  handlePathChange,
  setFileName,
  download
}) {
  const [pathInput, setPathInput] = useState("");

  useEffect(() => {
    setPathInput(path);
  }, [path]);

  function navigateTo(dirName) {
    if (!loading) handlePathChange(pathUtils.join(path, dirName));
  }

  function navigateBack() {
    /**
     * pathUtils.dirname tested cases:
     * - "/root/.raiden/" => "/root"
     * - "/root/.raiden" => "/root"
     * - "/root" => "/"
     * - "/" => "/"
     */
    if (!loading) handlePathChange(pathUtils.dirname(path));
  }

  return (
    <>
      <div className="file-explorer-navbar">
        <Button className="back" onClick={() => navigateBack()}>
          <BackIcon /> Back
        </Button>

        <Input
          value={pathInput}
          onValueChange={setPathInput}
          onEnterPress={() => handlePathChange(pathInput)}
          append={
            <Button onClick={() => handlePathChange(pathInput)}>Go to</Button>
          }
        />
      </div>

      <div className="file-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="size">Size</th>
              <th className="time">Last modified</th>
              <th className="action"> </th>
            </tr>
          </thead>
          <tbody style={{ opacity: loading ? 0.5 : 1 }}>
            {fileList.map((file, i) => (
              <tr
                key={i}
                onClick={() => {
                  if (file.isDirectory) navigateTo(file.name);
                  else setFileName(file.name);
                }}
              >
                <td className="name">
                  {file.isDirectory ? <DirIcon /> : <FileIcon />}
                  {file.name}
                </td>
                <td className="size">
                  {file.isDirectory ? "-" : humanFileSize(file.size)}
                </td>
                <td className="time">
                  {file.month} {file.day} {file.time}
                </td>
                <td
                  className={`action ${file.isDirectory ? "" : "file"}`}
                  onClick={
                    file.isDirectory
                      ? null
                      : () => download(pathUtils.join(path, file.name))
                  }
                >
                  {file.isDirectory ? null : <DownloadIcon />}
                </td>
              </tr>
            ))}
            {loading && !fileList.length && (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

FileExplorer.propTypes = {
  path: PropTypes.string.isRequired,
  fileList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  handlePathChange: PropTypes.func.isRequired,
  setFileName: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired
};

export default FileExplorer;
