import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { isEmpty } from "lodash";
// This module
import Dependencies from "../InstallCardComponents/Dependencies";
// Utils
import humanFileSize from "utils/humanFileSize";
import getRepoSlugFromManifest from "utils/getRepoSlugFromManifest";
import { shortAuthor } from "utils/format";
import newTabProps from "utils/newTabProps";
// Components
import Button from "components/Button";
import Card from "components/Card";
import ReadMoreMarkdown from "components/ReadMoreMarkdown";
import Columns from "components/Columns";
import Switch from "components/Switch";
import DnpNameVerified from "components/DnpNameVerified";
import Ok from "components/Ok";
import defaultAvatar from "img/defaultAvatar.png";
import { MdMoreHoriz, MdClose } from "react-icons/md";
// Styles
import "./info.scss";

function OkBadge({ ok, loading, msg, ...props }) {
  const status = ok ? "ok" : loading ? "" : "not-ok";
  return (
    <Ok
      className={`status-badge ${status}`}
      {...{ ok, loading, msg }}
      {...props}
    />
  );
}

export default function InstallerStepInfo({
  dnp,
  onInstall,
  disableInstallation,
  optionsArray
}) {
  const [showResolveStatus, setShowResolveStatus] = useState(false);
  const [showAvailableStatus, setShowAvailableStatus] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const { resolving, manifest, requestResult, tag } = dnp || {};
  const { name } = manifest || {};

  // Otherwise, show info an allow an install
  const { avatar = defaultAvatar, origin } = dnp || {};
  const {
    shortDescription,
    description,
    author,
    version,
    upstreamVersion,
    image
  } = manifest || {};
  const { size } = image || {};
  // If the repoSlug is invalid, it will be returned as null
  const repoSlug = getRepoSlugFromManifest(manifest);

  // Resolution status
  const compatible = !isEmpty((requestResult || {}).dnps);
  const notCompatible = !isEmpty((requestResult || {}).error);

  /**
   * Construct expandable pannels
   */
  const expandablePanels = [
    {
      name: "Compatible status",
      show: showResolveStatus,
      close: () => setShowResolveStatus(false),
      Component: () => (
        <Dependencies
          noCard
          request={requestResult || {}}
          resolving={resolving || false}
        />
      )
    },
    {
      name: "Available status",
      show: showAvailableStatus,
      close: () => setShowAvailableStatus(false),
      Component: () => <Ok ok={true} msg={"All package resources available"} />
    },
    {
      name: "Special options",
      show: showOptions,
      close: () => setShowOptions(false),
      Component: () =>
        optionsArray.map(({ id, name, checked, toggle }) => (
          <Switch
            key={id}
            checked={checked}
            onToggle={toggle}
            label={name}
            id={"switch-" + id}
          />
        ))
    }
  ].filter(panel => panel.show);

  return (
    <>
      <Card className="installer-header">
        <div className="details-header">
          <div className="left avatar">
            <img src={avatar} alt="Avatar" />
          </div>
          <div className="right">
            <div className="right-top">
              <div className="info">
                <DnpNameVerified name={name} origin={origin} />
                <div className="subtle-header">{shortAuthor(author)}</div>
                <div className="right-bottom">
                  <OkBadge
                    loading={resolving}
                    ok={compatible}
                    msg={
                      compatible
                        ? "Compatible"
                        : resolving
                        ? "Resolving"
                        : notCompatible
                        ? "Not compatible"
                        : "Error"
                    }
                    onClick={() => setShowResolveStatus(x => !x)}
                  />
                  <OkBadge
                    ok={true}
                    msg={"Available"}
                    onClick={() => setShowAvailableStatus(x => !x)}
                  />
                </div>
              </div>
              <div className="actions">
                {optionsArray.length > 0 && (
                  <div
                    className="subtle-header more-options"
                    onClick={() => setShowOptions(x => !x)}
                  >
                    <MdMoreHoriz />
                    <span>options</span>
                  </div>
                )}

                <Button
                  className="install"
                  variant="dappnode"
                  onClick={onInstall}
                  disabled={disableInstallation}
                >
                  {tag}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="expandable-info">
          {expandablePanels.map(panel => (
            <div>
              <div className="subtle-header">
                <span>{panel.name}</span>
                <MdClose onClick={panel.close} />
              </div>
              <panel.Component />
            </div>
          ))}
        </div>

        <Columns className="details-body">
          {/* Left */}
          <div>
            <div className="subtle-header">DESCRIPTION</div>
            <ReadMoreMarkdown source={shortDescription || description} />
            {shortDescription && (
              <>
                <div className="subtle-header">DETAILS</div>
                <ReadMoreMarkdown source={description} />
              </>
            )}
          </div>
          {/* Right */}
          <div>
            <div className="subtle-header">SIZE</div>
            <div>{humanFileSize(size)}</div>
            <div className="subtle-header">VERSION</div>
            <div>
              {repoSlug && version ? (
                <a
                  href={`https://github.com/${repoSlug}/releases/v${version}`}
                  {...newTabProps}
                >
                  {version}
                </a>
              ) : (
                version
              )}{" "}
              {upstreamVersion && `(${upstreamVersion} upstream)`}{" "}
              {origin || ""}
            </div>
            <div className="subtle-header">CREATED BY</div>
            <ReactMarkdown className="no-p-style" source={author} />
          </div>
        </Columns>
      </Card>
    </>
  );
}

InstallerStepInfo.propTypes = {
  dnp: PropTypes.object
};
