import React from "react"

export default class LogProgress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // this.progressLog = {msg: {}, order: []
    console.log(JSON.stringify(this.props))
    const progressLog = this.props.progressLog
    const msgs = progressLog.msg || {}
    const pakagesOrder = progressLog.order || []
    const items = pakagesOrder.map((name, i) => {
      let msg = msgs[name] || 'loading...'
      return (
        <li key={i}>{name + ': ' + msg}</li>
      )
    })
    // alert alert-success
    // alert alert-danger
    if (pakagesOrder.length == 0) {
      return null
    } else {
      return (
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">Installation progress</h4>
            <ul>
              {items}
            </ul>
        </div>
      );
    }
  }
}
