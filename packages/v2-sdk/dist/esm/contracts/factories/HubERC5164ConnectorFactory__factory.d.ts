import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { HubERC5164ConnectorFactory, HubERC5164ConnectorFactoryInterface } from "../HubERC5164ConnectorFactory.js";
export declare class HubERC5164ConnectorFactory__factory {
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
    static createInterface(): HubERC5164ConnectorFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): HubERC5164ConnectorFactory;
}
//# sourceMappingURL=HubERC5164ConnectorFactory__factory.d.ts.map