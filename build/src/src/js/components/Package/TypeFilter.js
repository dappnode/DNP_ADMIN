import React from 'react'


function add(e, array) {
  if (array.includes(e)) return array
  else array.push(e)
  return array
}


function remove(e, array) {
  const index = array.indexOf(e);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array
}


export default class TypeFilter extends React.Component {
  // directory={this.state.directory}
  // updateSelectedTypes={this.updateSelectedTypes.bind(this)}

  onChange(e) {
    const type = e.target.id
    let selectedTypes = this.props.selectedTypes || []

    if (e.target.checked) {
      this.props.updateSelectedTypes(add(type, selectedTypes))
    } else {
      this.props.updateSelectedTypes(remove(type, selectedTypes))
    }
  }

  render() {
    const directory = this.props.directory || []
    let uniqueTypes = []
    directory.map(p => {
      if (p && p.manifest && p.manifest.type
        && !uniqueTypes.includes(p.manifest.type)) {
          uniqueTypes.push(p.manifest.type)
        }
    })

    const selectedTypes = this.props.selectedTypes || []
    const items = uniqueTypes.map((type, i) => (
      <label key={i} for={type} className="mr-3">
        <input
        onChange={this.onChange.bind(this)}
        checked={selectedTypes.includes(type)}
        className="mr-2"
        type="checkbox" value="" id={type}/>
        {type}
      </label>
    ))

    // Prevent an ugly text
    if (items.length == 0) {
      return null

    } else {
      return (
        <form>
          <a className="mr-3">Filter by type:</a>
          {items}
        </form>
      )
    }
  }
}
