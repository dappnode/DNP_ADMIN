import React from "react";

const defaultTypes = { library: false };

export default class TypeFilter extends React.Component {
  // directory={this.state.directory}
  // updateSelectedTypes={this.updateSelectedTypes.bind(this)}

  onChange(e) {
    const type = e.target.id;
    if (e.target.checked) {
      this.props.updateSelectedTypes({
        ...this.props.selectedTypes,
        [type]: true
      });
    } else {
      this.props.updateSelectedTypes({
        ...this.props.selectedTypes,
        [type]: false
      });
    }
  }

  render() {
    const directory = this.props.directory || {};
    // Adding default types
    let uniqueTypes = defaultTypes;
    Object.values(directory).forEach(dnp => {
      if ((dnp.manifest || {}).type) {
        uniqueTypes[dnp.manifest.type] = true;
      }
    });

    const selectedTypes = this.props.selectedTypes || {};
    const items = Object.keys(uniqueTypes).map((type, i) => (
      <label key={i} htmlFor={type} className="mr-3">
        <input
          onChange={this.onChange.bind(this)}
          // "checked" should always be defined to prevent react's error "uncontrolled to controlled input"
          checked={selectedTypes[type] || false}
          className="mr-2"
          type="checkbox"
          value=""
          id={type}
        />
        {type}
      </label>
    ));

    // Prevent an ugly text
    if (items.length === 0) {
      return null;
    } else {
      return (
        <form>
          <span className="mr-3">Filter by type:</span>
          {items}
        </form>
      );
    }
  }
}
