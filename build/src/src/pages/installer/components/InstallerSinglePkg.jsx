import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import ReactMarkdown from "react-markdown";
import { toSentence } from "utils/strings";
import humanFileSize from "utils/humanFileSize";
import getRepoSlugFromManifest from "utils/getRepoSlugFromManifest";
import { shortNameCapitalized, shortAuthor } from "utils/format";
// This module
import * as s from "../selectors";
import * as a from "../actions";
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
import Dependencies from "./InstallCardComponents/Dependencies";
import SpecialPermissions from "./InstallCardComponents/SpecialPermissions";
import Vols from "./InstallCardComponents/Vols";
import Envs from "./InstallCardComponents/Envs";
import Ports from "./InstallCardComponents/Ports";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Button, { ButtonLight } from "components/Button";
import Card from "components/Card";
import Switch from "components/Switch";
import ReadMoreMarkdown from "components/ReadMoreMarkdown";
import defaultAvatar from "img/defaultAvatar.png";

function InstallerInterface({
  id,
  dnp,
  isQueryDnpUpdated,
  progressLogs,
  // Actions
  install,
  clearUserSet,
  fetchPackageRequest,
  // Extra
  history
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(() => {
    clearUserSet();
    fetchPackageRequest(id);
  }, [id]);

  const { loading, resolving, error, manifest, requestResult, tag } = dnp || {};
  const { name, type } = manifest || {};

  // When the DNP is updated (finish installation), redirect to /packages
  useEffect(() => {
    if (isQueryDnpUpdated && name) history.push(packagesRootPath + "/" + name);
  }, [tag]);

  if (error && !manifest) return <Error msg={`Error: ${error}`} />;
  if (loading) return <Loading msg={"Loading DNP data..."} />;
  if (!dnp && !error) return <Error msg={"Package not found"} />;

  /**
   * Filter options according to the current package
   * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
   */
  const availableOptions = [];
  if ((id || "").startsWith("/ipfs/") && type === "dncore")
    availableOptions.push("BYPASS_CORE_RESTRICTION");

  // Otherwise, show info an allow an install
  const { avatar = defaultAvatar, origin } = dnp || {};
  const { shortDescription, description, author, version, image } =
    manifest || {};
  const { size } = image || {};
  const repoSlug = getRepoSlugFromManifest(manifest);
  const changelogUrl = `https://github.com/dappnode/${repoSlug}/tag/v${version}`;

  return (
    <>
      <ProgressLogs progressLogs={progressLogs} />

      <Card className="installer-header">
        <div className="details-header">
          <div className="left avatar">
            <img src={avatar} alt="Avatar" />
          </div>
          <div className="right">
            <div className="info">
              <div className="name">{shortNameCapitalized(name)}</div>
              <div className="subtle-header">CREATED BY</div>
              <div className="badge">{shortAuthor(author)}</div>
            </div>
            <Button
              className="action"
              variant="dappnode"
              onClick={() => install(id, options)}
              disabled={!isEmpty(progressLogs)}
            >
              {tag}
            </Button>
          </div>
        </div>

        <div className="options">
          {availableOptions.map(option => (
            <Switch
              checked={options[option]}
              onToggle={value => setOptions({ [option]: value })}
              label={toSentence(option)}
              id={"switch-" + option}
            />
          ))}
        </div>

        <div className="details-body">
          <div className="left">
            <div className="subtle-header">DESCRIPTION</div>
            <ReadMoreMarkdown source={shortDescription || description} />
            {shortDescription && (
              <>
                <div className="subtle-header">DETAILS</div>
                <ReadMoreMarkdown source={description} />
              </>
            )}
          </div>
          <div className="right">
            <div className="subtle-header">SIZE</div>
            <div>{humanFileSize(size)}</div>
            <div className="subtle-header">VERSION</div>
            <div>
              {version} {origin || ""} <a href={changelogUrl}>changelog</a>
            </div>
            <div className="subtle-header">CREATED BY</div>
            <ReactMarkdown className="no-p-style" source={author} />
          </div>
        </div>
      </Card>

      <Dependencies
        request={requestResult || {}}
        resolving={resolving || false}
      />

      <SpecialPermissions dnp={dnp} />

      {showSettings ? (
        <>
          <Envs />
          <Ports />
          <Vols />
        </>
      ) : (
        <ButtonLight onClick={() => setShowSettings(true)}>
          Show advanced settings
        </ButtonLight>
      )}
    </>
  );
}

InstallerInterface.propTypes = {
  id: PropTypes.string.isRequired,
  dnp: PropTypes.object,
  history: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  id: s.getQueryId,
  dnp: s.getQueryDnp,
  isQueryDnpUpdated: s.getIsQueryDnpUpdated,
  progressLogs: (state, ownProps) =>
    getProgressLogsByDnp(state, s.getQueryIdOrName(state, ownProps)),
  // For the withTitle HOC
  subtitle: s.getQueryIdOrName
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  install: a.install,
  clearUserSet: a.clearUserSet,
  fetchPackageRequest: a.fetchPackageRequest
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
