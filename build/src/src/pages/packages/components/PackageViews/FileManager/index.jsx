import React, { useState, useEffect } from "react";
import api from "API/rpcMethods";
import PropTypes from "prop-types";
// Components
import Card from "components/Card";
import To from "./To";
import From from "./From";
import FileExplorer from "./FileExplorer";

function FileManager({ dnp }) {
  const id = dnp.name;
  const containerName = dnp.packageName;

  const [path, setPath] = useState("");
  const [filename, setFileName] = useState("");

  useEffect(() => {
    async function getWorkingDir() {
      try {
        const workingDir = await api.getContainerWorkingDir(
          { containerName },
          { toastOnError: true }
        );
        if (workingDir) setPath(workingDir);
        else console.error(`Broken response on getWorkingDir`, workingDir);
      } catch (e) {
        console.error(`Error on getWorkingDir: ${e.stack}`);
      }
    }
    getWorkingDir();
  }, [containerName]);

  return (
    <>
      <SubTitle>File Manager</SubTitle>
      <Card>
        <FileExplorer {...{ containerName, path, setPath, setFileName }} />
        <To {...{ id, path, setPath }} />
        <From {...{ id, path, filename }} />
      </Card>
    </>
  );
}

FileManager.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired
  }).isRequired
};

export default FileManager;
