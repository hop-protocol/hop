import { Chain } from '#models/index.js';
export declare function getBlockNumberFromDate(chain: Chain, timestamp: number): Promise<number>;
export declare function getBlockNumberFromDateUsingEtherscan(chain: string, timestamp: number): Promise<number>;
export declare function getBlockNumberFromDateUsingLib(provider: any, timestamp: number): Promise<number>;
//# sourceMappingURL=getBlockNumberFromDate.d.ts.map