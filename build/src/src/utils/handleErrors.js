export default function handleErrors(fn) {
  return async function(...args) {
    try {
      await fn(...args);
    } catch (e) {
      console.error(`Redux-thunk error hanlder: ${e.stack}`);
    }
  };
}
