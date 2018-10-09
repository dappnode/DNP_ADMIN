import React from "react";
import PropTypes from "prop-types";

const inputId = "static-ip-input-id";

export default class StaticIp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enable: false };
  }

  static propTypes = {
    staticIp: PropTypes.string,
    setStaticIp: PropTypes.func.isRequired
  };

  enableStaticIp() {
    this.setState({ enable: true });
  }

  disableStaticIp() {
    this.props.setStaticIp(null);
  }

  setStaticIp() {
    const staticIp = document.getElementById(inputId).value;
    this.props.setStaticIp(staticIp);
    this.setState({ enable: false });
  }

  render() {
    const margin = "5px";
    const padding = "0.7rem";

    // Three states:
    let content;
    // 1. Disabled
    if (!this.props.staticIp && !this.state.enable) {
      content = (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={this.enableStaticIp.bind(this)}
        >
          Enable
        </button>
      );
    }
    // 2. Disabled but about to enable
    if (!this.props.staticIp && this.state.enable) {
      content = (
        <div className="input-group">
          <input
            id={inputId}
            type="text"
            className="form-control"
            placeholder="Your static ip..."
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.setStaticIp.bind(this)}
            >
              Set
            </button>
          </div>
        </div>
      );
    }
    // 3. Enabled
    if (this.props.staticIp) {
      content = (
        <div className="input-group">
          <input
            id={inputId}
            type="text"
            className="form-control"
            placeholder={this.props.staticIp || "Your static ip..."}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.setStaticIp.bind(this)}
            >
              Set
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={this.disableStaticIp.bind(this)}
            >
              Disable
            </button>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="section-subtitle">Static IP</div>
        <div className="card mb-3">
          <div className="card-body" style={{ padding }}>
            <div className="row">
              <div className="col" style={{ margin, overflow: "hidden" }}>
                {content}
              </div>
            </div>
          </div>
        </div>
        <div className="section-subtitle">Packages</div>
      </React.Fragment>
    );
  }
}
