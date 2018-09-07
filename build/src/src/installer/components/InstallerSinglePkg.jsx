import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import * as utils from "../utils";
import eventBus from "eventBus";
import Loading from "components/Loading";
import Error from "components/Error";
import defaultAvatar from "img/defaultAvatar.png";
import humanFileSize from "utils/humanFileSize";
import InstallCard from "./InstallCard";
// Components
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class InstallerInterfaceView extends React.Component {
  componentWillMount() {
    const url = this.props.match.params.id;
    const id = utils.urlToId(url);
    token = eventBus.subscribe("connection_open", () => {
      this.props.fetchPackageRequest(id);
    });
    if (isOpen()) this.props.fetchPackageRequest(id);
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

  render() {
    const url = this.props.match.params.id;
    const id = utils.urlToId(url);
    const pkg = this.props.packageData[id];
    const connectionOpen = this.props.connectionOpen;

    if (!connectionOpen) {
      return <Loading msg="Openning connection..." />;
    }

    if (!pkg || pkg.error) {
      return <Error msg={"Package " + id + " not found"} />;
    }

    if (pkg.fetching) {
      return <Loading msg={"Fetching " + id + "..."} />;
    }

    const manifest = pkg.manifest || {};
    const avatar = pkg.avatar || defaultAvatar;
    const size = manifest.image ? humanFileSize(manifest.image.size) || "" : "";
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
          <h1>Install {manifest.name}</h1>
        </div>
        {/* Package info */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">{manifest.name}</h4>
            <div className="row">
              <div className="col-4" style={{ maxWidth: 200 }}>
                <img src={avatar} className="card-img-top" alt="Avatar" />
              </div>
              <div className="col-8">
                <p>{manifest.description}</p>
                <p>By {manifest.author}</p>
                <p>
                  Version {manifest.version} ({size})
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Package installation request and approval */}
        <div className="card mb-4">
          <div className="card-body">
            <InstallCard
              id={id}
              manifest={manifest}
              request={{
                ...(pkg.requestResult || {}),
                fetching: pkg.fetchingRequest
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  directory: selector.getDirectoryNonCores,
  packageData: selector.packageData,
  connectionOpen: selector.connectionOpen
});

const mapDispatchToProps = dispatch => {
  return {
    fetchPackageRequest: id => {
      dispatch(action.fetchPackageData(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerInterfaceView);
