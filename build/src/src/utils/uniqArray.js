function uniq(array) {
    return [ ...new Set(array.map(o => JSON.stringify(o))) ].map(o => JSON.parse(o));
}

export default uniq