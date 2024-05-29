import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ERC5164Connector, ERC5164ConnectorInterface } from "../ERC5164Connector.js";
export declare class ERC5164Connector__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        stateMutability: string;
        type: string;
        inputs?: undefined;
        name?: undefined;
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
    })[];
    static createInterface(): ERC5164ConnectorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC5164Connector;
}
//# sourceMappingURL=ERC5164Connector__factory.d.ts.map