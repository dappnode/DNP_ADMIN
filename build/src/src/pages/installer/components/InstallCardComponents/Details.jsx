import React from "react";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";
import ReactMarkdown from "react-markdown";
// Utils
import getRepoSlugFromManifest from "utils/getRepoSlugFromManifest";
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
  const repoSlug = getRepoSlugFromManifest(manifest);

  const data = {
    "Developed by": <ReactMarkdown className="no-p-style" source={author} />,
    "Download size": humanFileSize(size),
    Version: (
      <span>
        {version} {origin || ""}
        {Boolean(repoSlug && version && !origin) && (
          <>
            {" - "}
            <a href={`https://github.com/dappnode/${repoSlug}/tag/v${version}`}>
              changelog
            </a>
          </>
        )}
      </span>
    )
  };

  return (
    <div className="installer-details dappnode-links">
      <img src={avatar} alt="Avatar" />
      <div>
        <ReadMore>
          <header>About this DNP</header>
          <ReactMarkdown className="no-p-style" source={description} />
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
