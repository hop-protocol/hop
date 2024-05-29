interface GasFeeDataResponse {
    status: string;
    data: {
        expiration: number;
        chainSlug: string;
        timestamp: number;
        blockNumber: number;
        feeData: {
            baseFeePerGas: string;
            l1BaseFee?: string;
        };
    };
}
interface GasPriceVerifyResponse {
    status: string;
    data: {
        valid: boolean;
        timestamp: number;
        gasPrice: string;
        minBaseFeePerGasFee: string;
        minBaseFeePerGasBlockNumber: number;
        minBaseFeePerGasTimestamp: number;
    };
}
interface GasCostEstimateResponse {
    status: string;
    data: {
        l1Fee: string;
        l2Fee: string;
        gasCost: string;
    };
}
interface GasCostEstimateVerifyResponse {
    status: string;
    data: {
        valid: boolean;
        timestamp: number;
        targetGasCost: string;
        minGasCostEstimate: string;
        minGasFeeDataBlockNumber: number;
        minGasFeeDataTimestamp: number;
        minGasFeeDataBaseFeePerGas: string;
        minGasFeeDataL1BaseFee: string;
    };
}
export declare class GasPriceOracle {
    baseURL: string;
    constructor(networkOrBaseURL: string);
    getGasFeeData(chain: string, timestamp?: number): Promise<GasFeeDataResponse>;
    verifyGasPrice(chain: string, timestamp: number, gasPrice: string): Promise<GasPriceVerifyResponse>;
    estimateGasCost(chain: string, timestamp: number | null, gasLimit: number, txData: string): Promise<GasCostEstimateResponse>;
    verifyGasCostEstimate(chain: string, timestamp: number, gasLimit: number, txData: string, targetGasCost: string): Promise<GasCostEstimateVerifyResponse>;
}
export {};
//# sourceMappingURL=GasPriceOracle.d.ts.map