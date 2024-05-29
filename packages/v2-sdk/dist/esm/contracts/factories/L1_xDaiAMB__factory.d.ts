import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { L1_xDaiAMB, L1_xDaiAMBInterface } from "../L1_xDaiAMB.js";
export declare class L1_xDaiAMB__factory {
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
        constant?: undefined;
        outputs?: undefined;
        payable?: undefined;
        stateMutability?: undefined;
    })[];
    static createInterface(): L1_xDaiAMBInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): L1_xDaiAMB;
}
//# sourceMappingURL=L1_xDaiAMB__factory.d.ts.map