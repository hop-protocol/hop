export interface Network {
    name: string;
    networkId: number;
    rpcUrls: string[];
    explorerUrls: string[];
    nativeBridgeUrl?: string;
    waitConfirmations: number;
}
export interface Networks {
    [key: string]: Network;
}
//# sourceMappingURL=types.d.ts.map