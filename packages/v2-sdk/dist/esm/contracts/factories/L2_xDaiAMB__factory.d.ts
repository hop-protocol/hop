import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { L2_xDaiAMB, L2_xDaiAMBInterface } from "../L2_xDaiAMB.js";
export declare class L2_xDaiAMB__factory {
    static readonly abi: ({
        type: string;
        stateMutability: string;
        payable: boolean;
        outputs: {
            type: string;
            name: string;
        }[];
        name: string;
        inputs: {
            type: string;
            name: string;
        }[];
        constant: boolean;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            type: string;
            name: string;
            indexed: boolean;
        }[];
        anonymous: boolean;
        stateMutability?: undefined;
        payable?: undefined;
        outputs?: undefined;
        constant?: undefined;
    })[];
    static createInterface(): L2_xDaiAMBInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): L2_xDaiAMB;
}
//# sourceMappingURL=L2_xDaiAMB__factory.d.ts.map