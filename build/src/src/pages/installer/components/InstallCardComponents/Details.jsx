import React, { useState, useEffect } from "react";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";
// Icons
import { MdUnfoldMore, MdUnfoldLess } from "react-icons/md";
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
  const [readMore, setReadMore] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  useEffect(() => {
    function update() {
      const height = document.getElementById("description").clientHeight;
      setShowReadMore(height >= 121); // max-height of .description
    }
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const { manifest = {}, avatar = defaultAvatar, origin } = dnp;
  const { description, author, version, image } = manifest;
  const size = humanFileSize((image || {}).size || "");
  const data = {
    "Developed by": author,
    "Download size": size,
    Version: `${version} ${origin || ""}`
  };

  return (
    <div className="installer-details">
      <img src={avatar} alt="Avatar" />
      <div>
        <div id="description" className={readMore ? "" : "short"}>
          <header>About this DNP</header>
          {description}
        </div>
        {showReadMore && (
          <span className="read-more" onClick={() => setReadMore(!readMore)}>
            {readMore ? (
              <>
                <MdUnfoldLess /> Read less
              </>
            ) : (
              <>
                <MdUnfoldMore /> Read more
              </>
            )}
          </span>
        )}

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
