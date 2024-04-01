"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockNumberFromDateUsingLib = exports.getBlockNumberFromDateUsingEtherscan = exports.getBlockNumberFromDate = void 0;
// @ts-expect-error No types as of 20240128
const ethereum_block_by_date_1 = __importDefault(require("ethereum-block-by-date"));
const luxon_1 = require("luxon");
const fetchJsonOrThrow_js_1 = require("./fetchJsonOrThrow.js");
const getEtherscanApiKey_js_1 = require("./getEtherscanApiKey.js");
const getEtherscanApiUrl_js_1 = require("./getEtherscanApiUrl.js");
async function getBlockNumberFromDate(chain, timestamp) {
    const chainSlug = chain.slug;
    const chainProvider = chain.provider;
    const useEtherscan = (0, getEtherscanApiKey_js_1.getEtherscanApiKey)('mainnet', chainSlug);
    if (useEtherscan) {
        return getBlockNumberFromDateUsingEtherscan(chainSlug, timestamp);
    }
    return getBlockNumberFromDateUsingLib(chainProvider, timestamp);
}
exports.getBlockNumberFromDate = getBlockNumberFromDate;
async function getBlockNumberFromDateUsingEtherscan(chain, timestamp) {
    const apiKey = (0, getEtherscanApiKey_js_1.getEtherscanApiKey)('mainnet', chain);
    if (!apiKey) {
        throw new Error('Please add an etherscan api key for ' + chain);
    }
    const baseUrl = (0, getEtherscanApiUrl_js_1.getEtherscanApiUrl)('mainnet', chain);
    if (!baseUrl) {
        throw new Error(`etherscan base url not found for chain ${chain}`);
    }
    const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`;
    const json = await (0, fetchJsonOrThrow_js_1.fetchJsonOrThrow)(url);
    if (json.status !== '1') {
        throw new Error(`could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(json)}`);
    }
    return Number(json.result);
}
exports.getBlockNumberFromDateUsingEtherscan = getBlockNumberFromDateUsingEtherscan;
async function getBlockNumberFromDateUsingLib(provider, timestamp) {
    const blockDater = new ethereum_block_by_date_1.default(provider);
    const date = luxon_1.DateTime.fromSeconds(timestamp).toJSDate();
    let retryCount = 0;
    let info;
    while (true) {
        try {
            info = blockDater.getDate(date);
            if (!info) {
                throw new Error('could not retrieve block number');
            }
        }
        catch (err) {
            retryCount++;
            // console.warn(`getBlockNumberFromDate: retrying ${retryCount}`)
            if (retryCount < 5)
                continue;
            break;
        }
        break;
    }
    if (!info) {
        throw new Error('could not retrieve block number');
    }
    return info.block;
}
exports.getBlockNumberFromDateUsingLib = getBlockNumberFromDateUsingLib;
//# sourceMappingURL=getBlockNumberFromDate.js.map