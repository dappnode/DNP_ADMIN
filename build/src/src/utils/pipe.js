const pipe = (...functions) => args =>
  functions.reduce((arg, fn) => fn(arg), args);

export default pipe;
