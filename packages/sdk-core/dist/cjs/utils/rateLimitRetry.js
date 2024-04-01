"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitRetry = void 0;
const promiseTimeout_js_1 = require("./promiseTimeout.js");
const index_js_1 = require("#config/index.js");
const wait_js_1 = require("./wait.js");
function rateLimitRetry(fn) {
    const id = `${Date.now()}`;
    const logPrefix = `ratelimitRetry-${id}`;
    return async (...args) => {
        let retries = 0;
        const retry = () => (0, promiseTimeout_js_1.promiseTimeout)(fn(...args), index_js_1.rpcTimeoutSeconds * 1000); // eslint-disable-line
        const showDebugLogs = false;
        while (true) {
            try {
                // the await here is intentional so it's caught in the try/catch below.
                const result = await retry();
                if (retries > 0) {
                    if (showDebugLogs) {
                        console.debug(logPrefix, `attempt #${retries} successful`);
                    }
                }
                return result;
            }
            catch (err) {
                const errMsg = err.message;
                const rateLimitErrorRegex = /(rate limit|too many concurrent requests|exceeded|socket hang up)/i;
                const timeoutErrorRegex = /(timeout|time-out|time out|timedout|timed out)/i;
                const connectionErrorRegex = /(ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED|SERVER_ERROR|EPROTO|EHOSTUNREACH|ERR_NAME_NOT_RESOLVED|ERR_FAILED|could not detect network)/i;
                const badResponseErrorRegex = /(bad response|response error|missing response|processing response error|invalid json response body|FetchError)/i;
                const revertErrorRegex = /revert/i;
                const oversizedDataRegex = /oversized data/i;
                const bridgeContractErrorRegex = /BRG:/;
                const nonceTooLowErrorRegex = /(nonce.*too low|same nonce|already been used|NONCE_EXPIRED|OldNonce|invalid transaction nonce)/i;
                const estimateGasFailedErrorRegex = /eth_estimateGas/i;
                const alreadyKnownErrorRegex = /(AlreadyKnown|already known)/;
                const feeTooLowErrorRegex = /(FeeTooLowToCompete|transaction underpriced)/;
                const isCallLookupRevertErrorRegex = /(missing revert data in call exception|CALL_EXCEPTION)/;
                const isRateLimitError = rateLimitErrorRegex.test(errMsg);
                const isTimeoutError = timeoutErrorRegex.test(errMsg);
                const isConnectionError = connectionErrorRegex.test(errMsg);
                const isBadResponseError = badResponseErrorRegex.test(errMsg);
                const isOversizedDataError = oversizedDataRegex.test(errMsg);
                const isBridgeContractError = bridgeContractErrorRegex.test(errMsg);
                const isNonceTooLowErrorError = nonceTooLowErrorRegex.test(errMsg);
                const isEstimateGasFailedError = estimateGasFailedErrorRegex.test(errMsg);
                const isAlreadyKnownError = alreadyKnownErrorRegex.test(errMsg);
                const isFeeTooLowError = feeTooLowErrorRegex.test(errMsg);
                // a server_error will also return a call_exception error, so we want to exclude server errors from actual contract call revert errors.
                const isCallLookupRevertError = isCallLookupRevertErrorRegex.test(errMsg) && !/failed response/.test(errMsg);
                // a connection error, such as 'ECONNREFUSED', will cause ethers to return a "missing revert data in call exception" error,
                // so we want to exclude server connection errors from actual contract call revert errors.
                const isRevertError = revertErrorRegex.test(errMsg) && !isConnectionError && !isTimeoutError;
                const shouldNotRetryErrors = (isOversizedDataError || isBridgeContractError || isNonceTooLowErrorError || isEstimateGasFailedError || isAlreadyKnownError || isFeeTooLowError || isCallLookupRevertError);
                const shouldRetry = (isRateLimitError || isTimeoutError || isConnectionError || isBadResponseError) && !isRevertError && !shouldNotRetryErrors;
                // console.debug(logPrefix, `isRateLimitError: ${isRateLimitError}, isTimeoutError: ${isTimeoutError}, isConnectionError: ${isConnectionError}, isBadResponseError: ${isBadResponseError}, isRevertError: ${isRevertError}, shouldRetry: ${shouldRetry}`)
                // throw error as usual if it's not a rate limit error
                if (!shouldRetry) {
                    if (!isCallLookupRevertError) {
                        // console.error(logPrefix, errMsg)
                    }
                    throw err;
                }
                retries++;
                // if it's a rate limit error, then throw error after max retries attempted.
                if (retries >= index_js_1.rateLimitMaxRetries) {
                    // console.error(logPrefix, `max retries reached (${rateLimitMaxRetries}). Error: ${err}`)
                    // this must be a regular console log to print original function name
                    // console.error('max retries reached', fn, id, ...args)
                    throw err;
                }
                const delayMs = (1 << retries) * 1000;
                if (showDebugLogs) {
                    console.warn(logPrefix, `retry attempt #${retries} failed with error "${errMsg}". retrying again in ${delayMs / 1000} seconds.`);
                    // this must be a regular console log to print original function name
                    console.log(fn, id, ...args);
                }
                // exponential backoff wait
                await (0, wait_js_1.wait)(delayMs);
            }
        }
    };
}
exports.rateLimitRetry = rateLimitRetry;
//# sourceMappingURL=rateLimitRetry.js.map