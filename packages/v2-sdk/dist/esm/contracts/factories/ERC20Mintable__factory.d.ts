import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ERC20Mintable, ERC20MintableInterface } from "../ERC20Mintable.js";
export declare class ERC20Mintable__factory {
    static readonly abi: ({
        constant: boolean;
        inputs: {
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        signature: string;
        anonymous?: undefined;
    } | {
        inputs: {
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        signature: string;
        constant?: undefined;
        name?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        signature: string;
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
    })[];
    static createInterface(): ERC20MintableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC20Mintable;
}
//# sourceMappingURL=ERC20Mintable__factory.d.ts.map