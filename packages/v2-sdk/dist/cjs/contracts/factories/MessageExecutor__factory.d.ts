import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { MessageExecutor, MessageExecutorInterface } from "../MessageExecutor.js";
export declare class MessageExecutor__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        anonymous?: undefined;
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
    })[];
    static createInterface(): MessageExecutorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MessageExecutor;
}
//# sourceMappingURL=MessageExecutor__factory.d.ts.map