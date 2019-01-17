/** 
 * @param {Array} array of objects: [ {id: 1}, {id: 2} ]
 * @param {Function} keyGetter: (item) => item.id
 * @return {Object} resulting object: { 1: {id: 1}, 2: {id: 2} }
 */
const arrayToObj = (array, keyGetter) =>
    array.reduce((obj, item) => {
        obj[keyGetter(item)] = item
        return obj
    }, {})

export default arrayToObj