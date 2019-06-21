import React from "react";
import PropTypes from "prop-types";
// Imgs
import errorAvatar from "img/errorAvatar.png";
import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import Card from "components/Card";
import Button from "components/Button";
import { stringIncludes, capitalize } from "utils/strings";
import { GoVerified } from "react-icons/go";

function DnpStore({ directory, openDnp, featured }) {
  return (
    <div className={`dnp-cards ${featured ? "featured" : ""}`}>
      {directory.map(dnp => {
        const { manifest, error, avatar = defaultAvatar, origin, tag } =
          dnp || {};
        const { name, description } = manifest || {};
        /* Show the button as disabled (gray) if it's updated */
        const disabled = stringIncludes(tag, "updated");
        /* Rename tag from "install" to "get" because there were too many "install" tags 
           Cannot change the actual tag because it is used for logic around the installer */
        const tagDisplay = tag === "INSTALL" ? "GET" : tag;
        const [shortName, repo] = name.split(/\.(.+)/);
        const verified = repo === "dnp.dappnode.eth";

        return (
          <Card
            key={name + origin}
            className="dnp-card"
            shadow
            onClick={() => openDnp(dnp.name)}
          >
            <div className="avatar">
              <img src={error ? errorAvatar : avatar} alt="avatar" />
            </div>

            <div className="title">
              {capitalize(shortName)}
              {verified && <GoVerified className="verified-badge" />}
            </div>

            <div className="badge">New version available</div>

            <div className="description">{description}</div>
            <Button className="action" variant="dappnode" disabled={disabled}>
              {tagDisplay}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

DnpStore.propTypes = {
  directory: PropTypes.array.isRequired,
  openDnp: PropTypes.func.isRequired
};

// Use `compose` from "redux" if you need multiple HOC
export default DnpStore;
