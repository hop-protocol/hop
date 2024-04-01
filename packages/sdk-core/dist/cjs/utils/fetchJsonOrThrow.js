"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJsonOrThrow = void 0;
const isValidUrl_js_1 = require("./isValidUrl.js");
const promiseTimeout_js_1 = require("./promiseTimeout.js");
async function fetchJsonOrThrow(url, timeoutMs = 5 * 1000) {
    try {
        if (!(0, isValidUrl_js_1.isValidUrl)(url)) {
            throw new Error(`url "${url}" is invalid`);
        }
        let signal;
        if (typeof AbortController !== 'undefined') {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), timeoutMs);
            signal = controller.signal;
        }
        const res = await (signal ? fetch(url, { signal }) : (0, promiseTimeout_js_1.promiseTimeout)(fetch(url), timeoutMs));
        const json = await res.json();
        if (!json || !(typeof json === 'object')) {
            throw new Error('expected json object for response');
        }
        return json;
    }
    catch (err) {
        if (/timedout/gi.test(err?.message)) {
            throw new Error(`fetchJsonOrThrow: Request to "${url}" timedout after ${timeoutMs}ms. Error: ${err.message}`);
        }
        throw new Error(`fetchJsonOrThrow error: ${err.message} errObj: ${JSON.stringify(err)}`);
    }
}
exports.fetchJsonOrThrow = fetchJsonOrThrow;
//# sourceMappingURL=fetchJsonOrThrow.js.map