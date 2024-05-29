import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RailsGateway, RailsGatewayInterface } from "../RailsGateway.js";
export declare class RailsGateway__factory {
    static readonly abi: ({
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
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
    })[];
    static createInterface(): RailsGatewayInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RailsGateway;
}
//# sourceMappingURL=RailsGateway__factory.d.ts.map