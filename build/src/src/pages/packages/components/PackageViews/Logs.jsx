import React from "react";
import PropTypes from "prop-types";
import * as selector from "../../selectors";
import { connect } from "react-redux";
import * as action from "../../actions";
import PubSub from "eventBus";

import Terminal from "./Terminal";
import "./switch.css";

const refreshInterval = 2 * 1000;
const terminalID = "terminal";

let token;

class DisplayLogs extends React.Component {
  constructor() {
    super();
    this.state = {
      autoRefresh: true,
      timestamps: false,
      search: "",
      lines: 200,
      handle: 0
    };
    this.toggleAutoRefresh = this.toggleAutoRefresh.bind(this);
    this.logPackage = this.logPackage.bind(this);
  }

  static propTypes = {
    dnp: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.handle = setInterval(this.logPackage, refreshInterval);
    const logErrorHandler = () => {
      clearInterval(this.handle);
      this.setState({ autoRefresh: false });
    };
    token = PubSub.subscribe("LOG_ERROR", logErrorHandler.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this.handle);
    PubSub.unsubscribe(token);
  }

  logPackage() {
    this.props.logPackage(this.props.dnp.name, {
      timestamps: this.state.timestamps,
      tail: this.state.lines
    });
  }

  toggleAutoRefresh = e => {
    if (this.state.autoRefresh) {
      // Shuting off auto-refresh
      clearInterval(this.handle);
    } else {
      // Turning on auto-refresh
      this.handle = setInterval(this.logPackage, 1000);
    }
    this.setState({ autoRefresh: !this.state.autoRefresh });
  };

  toggleTimestamps = e => {
    this.setState({ timestamps: !this.state.timestamps });
  };

  updateSearch = e => {
    this.setState({ search: e.target.value });
  };

  updateLines = e => {
    const n = e.target.value;
    if (!isNaN(parseInt(n, 10)) && isFinite(n) && parseInt(n, 10) > 0) {
      this.setState({ lines: parseInt(n, 10) });
    } else {
      console.warn("Attempting to use a wrong number of lines", n);
    }
  };

  scrollToBottom() {
    const element = document.getElementById(terminalID);
    if (element) element.scrollTop = element.scrollHeight;
  }

  render() {
    let logs = this.props.logs || "";
    let logsArray = logs.split(/\r?\n/);
    let logsFiltered = logsArray
      .slice(logsArray.length - this.state.lines)
      .filter(line =>
        line.toLowerCase().includes(this.state.search.toLowerCase())
      )
      .join("\n");

    return (
      <React.Fragment>
        <div className="section-subtitle">Logs</div>
        <div className="card mb-4">
          <div className="card-body">
            <div className="float-left mr-4 mb-1">
              <span className="switch switch-sm">
                <input
                  type="checkbox"
                  className="switch"
                  id="switch-refresh"
                  checked={this.state.autoRefresh}
                  onChange={this.toggleAutoRefresh}
                />
                <label htmlFor="switch-refresh">Auto-refresh logs</label>
              </span>
            </div>
            <div className="float-left mr-4 mb-1">
              <span className="switch switch-sm">
                <input
                  type="checkbox"
                  className="switch"
                  id="switch-ts"
                  checked={this.state.timestamps}
                  onChange={this.toggleTimestamps.bind(this)}
                />
                <label htmlFor="switch-ts">Display timestamps</label>
              </span>
            </div>
            <div className="float-left mr-4 mb-1">
              <button
                type="button"
                className="btn btn-outline-secondary tableAction-button"
                style={{
                  marginBottom: "8px",
                  position: "relative",
                  top: "-3px"
                }}
                onClick={this.scrollToBottom.bind(this)}
              >
                Scroll to bottom
              </button>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Lines</span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Number of lines to display..."
                value={this.state.lines}
                onChange={this.updateLines.bind(this)}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Search</span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Filter..."
                value={this.state.search}
                onChange={this.updateSearch.bind(this)}
              />
            </div>
            <Terminal text={logsFiltered} terminalID={terminalID} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    logs: selector.getDnpLogs(state, ownProps.dnp.name)
  };
};

const mapDispatchToProps = {
  logPackage: action.logPackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayLogs);
