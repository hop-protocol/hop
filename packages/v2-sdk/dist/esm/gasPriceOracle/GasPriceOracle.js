import { fetchJsonOrThrow } from '@hop-protocol/sdk';
export class GasPriceOracle {
    constructor(networkOrBaseURL) {
        if (networkOrBaseURL.startsWith('http')) {
            this.baseURL = networkOrBaseURL;
        }
        if (networkOrBaseURL === 'sepolia') {
            const url = 'https://v2-gas-price-oracle-sepolia.hop.exchange';
            this.baseURL = url;
        }
    }
    async getGasFeeData(chain, timestamp) {
        const url = new URL(`${this.baseURL}/v1/gas-fee-data`);
        url.searchParams.append('chain', chain);
        if (timestamp) {
            url.searchParams.append('timestamp', timestamp.toString());
        }
        const json = await fetchJsonOrThrow(url.toString());
        return json;
    }
    async verifyGasPrice(chain, timestamp, gasPrice) {
        const url = new URL(`${this.baseURL}/v1/gas-price-verify`);
        url.searchParams.append('chain', chain);
        url.searchParams.append('timestamp', timestamp.toString());
        url.searchParams.append('gasPrice', gasPrice);
        const json = await fetchJsonOrThrow(url.toString());
        return json;
    }
    async estimateGasCost(chain, timestamp, gasLimit, txData) {
        const url = new URL(`${this.baseURL}/v1/gas-cost-estimate`);
        url.searchParams.append('chain', chain);
        if (timestamp) {
            url.searchParams.append('timestamp', timestamp.toString());
        }
        url.searchParams.append('gasLimit', gasLimit.toString());
        url.searchParams.append('txData', txData);
        console.log('url:', url.toString());
        const json = await fetchJsonOrThrow(url.toString());
        return json;
    }
    async verifyGasCostEstimate(chain, timestamp, gasLimit, txData, targetGasCost) {
        const url = new URL(`${this.baseURL}/v1/gas-cost-estimate-verify`);
        url.searchParams.append('chain', chain);
        if (timestamp) {
            url.searchParams.append('timestamp', timestamp.toString());
        }
        url.searchParams.append('gasLimit', gasLimit.toString());
        url.searchParams.append('txData', txData.toString());
        url.searchParams.append('targetGasCost', targetGasCost.toString());
        console.log('url:', url.toString());
        const json = await fetchJsonOrThrow(url.toString());
        return json;
    }
}
//# sourceMappingURL=GasPriceOracle.js.map