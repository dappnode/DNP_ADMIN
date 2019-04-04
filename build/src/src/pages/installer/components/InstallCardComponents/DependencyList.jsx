import React from "react";
import PropTypes from "prop-types";
import computeSemverUpdateType from "utils/computeSemverUpdateType";
import DnpName from "components/DnpName";
import Linkify from "react-linkify";
import styled from "styled-components";

const InfoContainer = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fit, minmax(12rem, max-content));
`;

function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function OnInstallAlert({ manifest }) {
  const { onInstall } = (manifest || {}).warnings || {};
  if (!onInstall) return null;
  return (
    <div className="alert alert-warning" style={{ margin: "12px 0 6px 0" }}>
      <Linkify>{onInstall}</Linkify>
    </div>
  );
}

const Badge = ({ text }) => (
  <span
    className={`badge badge-warning`}
    style={{
      textTransform: "capitalize",
      marginLeft: "6px"
    }}
  >
    {text}
  </span>
);

function DependencyList({ deps }) {
  return (
    <>
      {deps.sort(byName).map(({ name, from, to, manifest }) => {
        const updateType = computeSemverUpdateType(from, to);
        const showBadge = updateType === "downgrade" || updateType === "major";
        return (
          <div key={name} className="dependency-list">
            <InfoContainer>
              <DnpName dnpName={name} />
              <span>
                {from ? `Update from ${from} to ${to}` : `Install ${to}`}
              </span>
              {showBadge && <Badge text={updateType} />}
            </InfoContainer>
            <OnInstallAlert manifest={manifest} />
          </div>
        );
      })}
    </>
  );
}

DependencyList.propTypes = {
  deps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      manifest: PropTypes.object.isRequired
    })
  ).isRequired
};

export default DependencyList;
