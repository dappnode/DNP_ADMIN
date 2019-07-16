import React, { useState } from "react";
import { title } from "../data";
import withTitle from "components/hoc/withTitle";
// Components
import PackageList from "./PackageList";

const PackagesHome = () => {
  const [showCoreDnps, setShowCoreDnps] = useState(false);
  const options = [
    { name: "My packages", showCoreDnps: false },
    { name: "System packages", showCoreDnps: true }
  ];

  return (
    <>
      <div className="horizontal-navbar">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => setShowCoreDnps(option.showCoreDnps)}
            className="item-container"
            style={{ whiteSpace: "nowrap" }}
          >
            <span
              className={`item ${
                showCoreDnps === option.showCoreDnps ? "active" : ""
              }`}
            >
              {option.name}
            </span>
          </button>
        ))}
      </div>

      <PackageList moduleName={title} coreDnps={showCoreDnps} />
    </>
  );
};

export default withTitle(title)(PackagesHome);
