import React from "react";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";
// Icons
import ReadMore from "components/ReadMore";
// Styles
import "./details.css";

/**
 * Fully responsive component without media queries
 * It subscribes to the window size in order to show
 * "Read more" or not. It is linked to css prop:
 *   .installer-details #description.short {
 *     max-height: 121px;
 *   }
 * Which limits the height of the component to 1px extra
 * to the height of 4 lines in default font size.
 */
function Details({ dnp }) {
  const { manifest, avatar = defaultAvatar, origin } = dnp || {};
  const { description, author, version, image } = manifest || {};
  const { size } = image || {};

  const data = {
    "Developed by": author,
    "Download size": humanFileSize(size),
    Version: `${version} ${origin || ""}`
  };

  return (
    <div className="installer-details">
      <img src={avatar} alt="Avatar" />
      <div>
        <ReadMore>
          <header>About this DNP</header>
          {description}
        </ReadMore>

        <div className="data">
          {Object.entries(data).map(([key, val]) => (
            <div key={key}>
              <header>{key}</header>
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Details;
