import { PriceFeed, PriceFeedApiKeys } from './PriceFeed.js';
export declare class PriceFeedFromS3 {
    priceFeed: PriceFeed;
    constructor(apiKeysMap?: PriceFeedApiKeys);
    setApiKeys(apiKeysMap?: PriceFeedApiKeys): void;
    getPriceByTokenSymbol(tokenSymbol: string): Promise<number>;
}
//# sourceMappingURL=PriceFeedFromS3.d.ts.map