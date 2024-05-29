export type Network = {
    name: string;
    chainId: number;
    publicRpcUrl: string;
    fallbackPublicRpcUrls: string[];
    explorerUrls: string[];
    nativeBridgeUrl?: string;
};
export type Networks = Record<string, Network>;
export declare const networks: Record<string, Record<string, Network>>;
//# sourceMappingURL=networks.d.ts.map