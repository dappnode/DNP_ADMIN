import React from "react";

export default class Check extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.check}>CHECK</button>
        <button onClick={this.props.init}>INIT</button>
        <ul>
          {this.props.items.map((e, i) => (
            <li key={i}>{e.id + ": " + e.msg}</li>
          ))}
        </ul>
      </div>
    );
  }
}
