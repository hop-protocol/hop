import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ERC5164ConnectorFactory, ERC5164ConnectorFactoryInterface } from "../ERC5164ConnectorFactory.js";
export declare class ERC5164ConnectorFactory__factory {
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
    static createInterface(): ERC5164ConnectorFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC5164ConnectorFactory;
}
//# sourceMappingURL=ERC5164ConnectorFactory__factory.d.ts.map