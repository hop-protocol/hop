import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { AliasFactory, AliasFactoryInterface } from "../AliasFactory.js";
export declare class AliasFactory__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
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
        stateMutability?: undefined;
        outputs?: undefined;
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
    static createInterface(): AliasFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): AliasFactory;
}
//# sourceMappingURL=AliasFactory__factory.d.ts.map