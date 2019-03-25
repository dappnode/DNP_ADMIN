import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import isIpv4 from "utils/isIpv4";

class StaticIpView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false
    };
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
    this.props.setStaticIp(this.props.staticIpInput);
    this.setState({ enable: false });
  }

  render() {
    const margin = "5px";
    const padding = "0.7rem";
    const width = "85px";

    const { staticIp, staticIpInput } = this.props;
    const ipIsValid = isIpv4(staticIpInput);

    // Three states:
    let content;
    // 1. Disabled
    if (!staticIp && !this.state.enable) {
      return (
        <div className="d-flex justify-content-between">
          <div className="section-subtitle">Static IP</div>
          <div>
            <button
              className="btn btn-outline-secondary float-right"
              type="button"
              onClick={this.enableStaticIp.bind(this)}
              style={{ width }}
            >
              Enable
            </button>
          </div>
        </div>
      );
    }
    // Declared components as varibles to avoid code duplication
    // - inputFieldComponent is used in case 2, 3
    // - setButtonComponent is used in case 2, 3
    // - disableButtonComponent is used in case 3
    const inputFieldComponent = (
      <input
        type="text"
        className="form-control"
        placeholder="Your static ip..."
        value={staticIpInput}
        onChange={e => this.props.updateStaticIpInput(e.target.value)}
        onKeyPress={e => {
          if (e.key === "Enter" && ipIsValid) this.setStaticIp.bind(this)();
        }}
      />
    );
    const setButtonComponent = (
      <button
        className="btn btn-outline-secondary"
        type="button"
        disabled={!ipIsValid}
        onClick={this.setStaticIp.bind(this)}
      >
        Set
      </button>
    );
    const disableButtonComponent = (
      <button
        className="btn btn-outline-danger"
        type="button"
        onClick={this.disableStaticIp.bind(this)}
      >
        Disable
      </button>
    );
    // 2. Disabled but about to enable
    if (this.state.enable) {
      content = (
        <div className="input-group">
          {inputFieldComponent}
          <div className="input-group-append">{setButtonComponent}</div>
        </div>
      );
    }
    // 3. Enabled
    if (staticIp && !this.state.enable) {
      content = (
        <div className="input-group">
          {inputFieldComponent}
          <div className="input-group-append">
            {setButtonComponent}
            {disableButtonComponent}
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
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  staticIp: selector.staticIp,
  staticIpInput: selector.staticIpInput
});

const mapDispatchToProps = {
  setStaticIp: action.setStaticIp,
  updateStaticIpInput: action.updateStaticIpInput
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticIpView);
