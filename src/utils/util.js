export function arrayRemoveItem(array, item) {
  const index = array.indexOf(item);
  if (index < 0) return { error: 'item not found' };
  return array.splice(index, 1);
}

export function formatDate(date) {
  return date.slice(0, 10).split('-').reverse().join('/');
}

export function getIntFromDate(date) {
  date = date.replace('T', '');
  date = date.replace('Z', '');
  date = date.replace('.', '');
  date = date.replace(/:/g, '');
  date = date.replace(/-/g, '');
  return parseInt(date);
}

export function throttle(func, delay) {
  let inProgress = false;
  return (...args) => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    func(...args); // Consider moving this line before the set timeout if you want the very first one to be immediate
    setTimeout(() => {
      inProgress = false;
    }, delay);
  };
}

export function getRandomId() {
  const min = Math.ceil(10000000);
  const max = Math.floor(99999999);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function expireOnTimeOut(func, timeout = 5000, delayCheck = 500) {
  const startTime = Date.now();
  const endTime = startTime + timeout;
  let timer = 0;
  const result = makeQuerablePromise(func());
  while (result.isPending()) {
    await sleep(delayCheck);
    timer += delayCheck;
    if (startTime + timer > endTime) {
      return new Error(`Function has taken more than ${timeout} seconds.`);
    }
  }
  return result;
}

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
export function makeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise;

  // Set initial state
  let isPending = true;
  let isRejected = false;
  let isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  const result = promise.then(
    (v) => {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    (e) => {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = function () {
    return isFulfilled;
  };
  result.isPending = function () {
    return isPending;
  };
  result.isRejected = function () {
    return isRejected;
  };
  return result;
}
