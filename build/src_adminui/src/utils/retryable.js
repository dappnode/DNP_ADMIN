// Make any async function attempt a 'times' number of retries before returning an error
const retryable = (fn, times = 3) => (...args) =>
  new Promise((resolve, reject) => {
    let attempt = 0;
    function retryAttempt() {
      fn(...args).then(resolve, e => {
        if (e && attempt++ < times)
          setTimeout(retryAttempt, 1000 * Math.random());
        else reject(e);
      });
    }
    retryAttempt();
  });

export default retryable;
