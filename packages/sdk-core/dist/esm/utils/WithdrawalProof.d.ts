type Transfer = any;
type TransferRoot = any;
export declare class WithdrawalProof {
    transferId: string;
    transferRootHash?: string;
    leaves?: string[];
    proof?: string[];
    transferIndex?: number;
    rootTotalAmount?: string;
    numLeaves?: number;
    transfer?: Transfer;
    transferRoot?: TransferRoot;
    network: string;
    constructor(network: string, transferId: string);
    generateProof(): Promise<string[]>;
    getProofPayload(): {
        transferId: string;
        transferRootHash: string | undefined;
        leaves: string[] | undefined;
        proof: string[] | undefined;
        transferIndex: number | undefined;
        rootTotalAmount: string | undefined;
        numLeaves: number | undefined;
    };
    getTxPayload(): {
        recipient: any;
        amount: any;
        transferNonce: any;
        bonderFee: any;
        amountOutMin: any;
        deadline: any;
        transferRootHash: string | undefined;
        rootTotalAmount: string | undefined;
        transferIdTreeIndex: number | undefined;
        siblings: string[] | undefined;
        totalLeaves: number | undefined;
    };
    checkWithdrawable(): void;
    private generateProofForTransferId;
    private getWithdrawalProofData;
    private makeRequest;
    private findTransfer;
    private queryTransfer;
    private queryTransferByTransactionHash;
    private queryWithdrew;
    private queryBondWithdrawal;
    private getTransferRootForTransferId;
    private queryTransferIdsForTransferRoot;
    private queryTransferRoot;
    private queryRootSet;
    private getTransferRoot;
    getTransferSents(options: any, lastId?: string): Promise<any>;
    private normalizeEntity;
}
export {};
//# sourceMappingURL=WithdrawalProof.d.ts.map