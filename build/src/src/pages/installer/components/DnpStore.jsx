import React from "react";
import PropTypes from "prop-types";
// Imgs
import errorAvatar from "img/errorAvatar.png";
import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import Card from "components/Card";
import Button from "components/Button";
import DnpNameVerified from "components/DnpNameVerified";
import { stringIncludes } from "utils/strings";

function DnpStore({ directory, openDnp, featured }) {
  // If there are no DNPs, don't render the component to prevent wierd empty spaces
  if (!directory.length) return null;

  return (
    <div className={`dnp-cards ${featured ? "featured" : ""}`}>
      {directory.map(dnp => {
        const { manifest, error, avatar = defaultAvatar, origin, tag } =
          dnp || {};
        const { name, shortDescription, description, style } = manifest || {};

        if (featured) {
          /**
           * Featured DNPs. Their size will be double a normal DNP card
           * Their style is customizable via the manifest
           */
          const { featuredBackground, featuredColor, featuredAvatarFilter } =
            style || {};
          return (
            <Card
              key={name + origin}
              className="dnp-card"
              shadow
              onClick={() => openDnp(dnp.name)}
              style={{
                background: featuredBackground,
                color: featuredColor
              }}
            >
              <div className="avatar-big">
                <img
                  style={{
                    filter: featuredAvatarFilter
                  }}
                  src={error ? errorAvatar : avatar}
                  alt="avatar"
                />
              </div>
              <div className="info-big">
                <div className="badge gray featured">Featured</div>

                <DnpNameVerified name={name} big />

                <div className="description">
                  {shortDescription || description}
                </div>
              </div>
            </Card>
          );
        } else {
          /**
           * Normal DNPs
           */
          const tagDisplay = tag === "INSTALL" ? "GET" : tag;
          /* Show the button as disabled (gray) if it's updated */
          const disabled = stringIncludes(tag, "updated");
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

              <DnpNameVerified name={name} />

              {/* <div className="badge">New version available</div> */}
              <div className="description">
                {shortDescription || description}
              </div>
              <Button className="action" variant="dappnode" disabled={disabled}>
                {tagDisplay}
              </Button>
            </Card>
          );
        }
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
