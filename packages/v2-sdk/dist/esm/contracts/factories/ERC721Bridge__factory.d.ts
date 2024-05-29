import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ERC721Bridge, ERC721BridgeInterface } from "../ERC721Bridge.js";
export declare class ERC721Bridge__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        anonymous?: undefined;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): ERC721BridgeInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC721Bridge;
}
//# sourceMappingURL=ERC721Bridge__factory.d.ts.map