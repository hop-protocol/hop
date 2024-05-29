import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Transporter, TransporterInterface } from "../Transporter.js";
export declare class Transporter__factory {
    static readonly abi: ({
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
    static createInterface(): TransporterInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Transporter;
}
//# sourceMappingURL=Transporter__factory.d.ts.map