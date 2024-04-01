"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseTimeout = void 0;
class TimeoutError extends Error {
}
async function promiseTimeout(promise, timeout) {
    return new Promise(async (resolve, reject) => {
        let timedout = false;
        const t = setTimeout(() => {
            timedout = true;
            reject(new TimeoutError('timedout'));
        }, timeout);
        // make it a promise if it's not one
        Promise.resolve(promise)
            .then((result) => {
            clearTimeout(t);
            if (!timedout) {
                resolve(result);
            }
        })
            .catch((err) => {
            clearTimeout(t);
            if (!timedout) {
                reject(err);
            }
        });
    });
}
exports.promiseTimeout = promiseTimeout;
//# sourceMappingURL=promiseTimeout.js.map