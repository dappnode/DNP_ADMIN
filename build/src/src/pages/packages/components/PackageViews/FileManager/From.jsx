import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Components
import Input from "components/Input";
import Button from "components/Button";

function From({ path, filename, download }) {
  const [fromPath, setFromPath] = useState("");

  useEffect(() => {
    setFromPath(path);
  }, [path]);

  useEffect(() => {
    setFromPath([(path || "").replace(/\/+$/, ""), filename].join("/"));
  }, [filename, path]);

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">
        Download from DAppNode Package
      </div>
      {/* FROM, chose path */}
      <Input
        placeholder="Container from path"
        value={fromPath}
        onValueChange={setFromPath}
        append={
          <Button onClick={() => download(fromPath)} disabled={!fromPath}>
            Download
          </Button>
        }
      />
    </div>
  );
}

From.propTypes = {
  path: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  download: PropTypes.func.isRequired
};

export default From;
