import React from "react";
import PropTypes from "prop-types";
// Imgs
import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import Card from "components/Card";
import Button from "components/Button";
import DnpNameVerified from "components/DnpNameVerified";
import { DirectoryItem } from "types";

function DnpStore({
  directory,
  openDnp,
  featured
}: {
  directory: DirectoryItem[];
  openDnp: (id: string) => void;
  featured: boolean;
}) {
  // If there are no DNPs, don't render the component to prevent wierd empty spaces
  if (!directory.length) return null;

  return (
    <div className={`dnp-cards ${featured ? "featured" : ""}`}>
      {directory.map(
        ({
          name,
          description,
          avatar,
          isInstalled,
          isUpdated,
          featuredStyle
        }) => {
          const tagDisplay = isUpdated
            ? "UPDATED"
            : isInstalled
            ? "UPDATE"
            : "GET";

          /**
           * Featured DNPs. Their size will be double a normal DNP card
           * Their style is customizable via the manifest
           */
          const { featuredBackground, featuredColor, featuredAvatarFilter } =
            featuredStyle || {};
          const cardStyle = {
            background: featuredBackground,
            color: featuredColor
          };
          const avatarStyle = {
            filter: featuredAvatarFilter
          };

          return (
            <Card
              key={name}
              className="dnp-card"
              shadow
              onClick={() => openDnp(name)}
              style={featured ? cardStyle : {}}
            >
              {featured ? (
                <>
                  <div className="avatar-big">
                    <img
                      style={avatarStyle}
                      src={avatar || defaultAvatar}
                      alt="avatar"
                    />
                  </div>
                  <div className="info-big">
                    <div className="badge gray featured">Featured</div>

                    <DnpNameVerified name={name} big />

                    <div className="description">{description}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="avatar">
                    <img src={avatar || defaultAvatar} alt="avatar" />
                  </div>

                  <DnpNameVerified name={name} />

                  {/* <div className="badge">New version available</div> */}
                  <div className="description">{description}</div>
                  <Button
                    className="action"
                    variant="dappnode"
                    /* Show the button as disabled (gray) if it's updated */
                    disabled={isUpdated}
                  >
                    {tagDisplay}
                  </Button>
                </>
              )}
            </Card>
          );
        }
      )}
    </div>
  );
}

DnpStore.propTypes = {
  directory: PropTypes.array.isRequired,
  openDnp: PropTypes.func.isRequired
};

// Use `compose` from "redux" if you need multiple HOC
export default DnpStore;
