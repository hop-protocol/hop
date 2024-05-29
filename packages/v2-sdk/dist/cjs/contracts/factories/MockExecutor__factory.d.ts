import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { MockExecutor, MockExecutorInterface } from "../MockExecutor.js";
export declare class MockExecutor__factory {
    static readonly abi: ({
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs: never[];
        stateMutability: string;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            indexed: boolean;
            internalType: string;
        }[];
        anonymous: boolean;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs?: undefined;
        stateMutability?: undefined;
        anonymous?: undefined;
    })[];
    static createInterface(): MockExecutorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockExecutor;
}
//# sourceMappingURL=MockExecutor__factory.d.ts.map