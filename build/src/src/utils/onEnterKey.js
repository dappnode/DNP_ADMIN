/**
 * To be used on html prop `onKeyDown`
 * onKeyDown={onEnterKey(method, arg1, arg2)}
 * @param {Function} fn
 * @param  {...any} args
 */
export default function onEnterKey(fn, ...args) {
  return e => {
    const key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key === 13) fn(...args);
  };
}
