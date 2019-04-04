import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { rootPath as packagesRootPath } from "pages/packages";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";

export default class Success extends React.Component {
  static propTypes = {
    manifest: PropTypes.object.isRequired
  };

  render() {
    const id = (this.props.manifest || {}).name;

    return (
      <>
        <SubTitle>Installed</SubTitle>
        <Card>
          <p style={{ color: "#2fbcb2" }}>
            <strong>Success ✓</strong>
          </p>
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            to={packagesRootPath + "/" + id}
          >
            <button className="btn btn-dappnode">GO TO PACKAGE</button>
          </Link>
        </Card>
      </>
    );
  }
}
