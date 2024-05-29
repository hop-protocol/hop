import { L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk';
export class ArbitrumRelayer {
    constructor(network = 'mainnet', l1Provider, l2Provider) {
        this.network = network;
        this.l1Provider = l1Provider;
        this.l2Provider = l2Provider;
    }
    async getExitPopulatedTx(l2TxHash) {
        const l2Receipt = await this.l2Provider.getTransactionReceipt(l2TxHash);
        const initiatingTxReceipt = new L2TransactionReceipt(l2Receipt);
        if (!initiatingTxReceipt) {
            throw new Error('Could not find initiating transaction');
        }
        const outgoingMessagesFromTx = await initiatingTxReceipt.getL2ToL1Messages(this.l1Provider, this.l2Provider);
        if (outgoingMessagesFromTx.length === 0) {
            throw new Error('Could not find outgoing message');
        }
        const msg = outgoingMessagesFromTx[0];
        if (!msg) {
            throw new Error('Could not find outgoing message');
        }
        // TODO: return populated tx only
        return msg.execute(this.l2Provider); // TODO: type
    }
    async redeemArbitrumTransaction(l1TxHash, messageIndex = 0) {
        const status = await this.getMessageStatus(l1TxHash, messageIndex);
        if (status !== L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2) {
            throw new Error('Message not deposited on L2');
        }
        const l1ToL2Message = await this.getL1ToL2Message(l1TxHash, messageIndex);
        return l1ToL2Message.redeem(this.l1Provider); // TODO: type
    }
    async getMessageStatus(l1TxHash, messageIndex = 0) {
        const l1ToL2Message = await this.getL1ToL2Message(l1TxHash, messageIndex);
        const res = await l1ToL2Message.waitForStatus();
        return res.status;
    }
    async getL1ToL2Message(l1TxHash, messageIndex = 0) {
        const l1ToL2Messages = await this.getL1ToL2Messages(l1TxHash);
        if (!l1ToL2Messages) {
            throw new Error('Could not find L1ToL2Message');
        }
        return l1ToL2Messages[messageIndex];
    }
    async getL1ToL2Messages(l1TxHash) {
        const l1Receipt = await this.l1Provider.getTransactionReceipt(l1TxHash);
        const l1TxReceipt = new L1TransactionReceipt(l1Receipt);
        return l1TxReceipt.getL1ToL2Messages(this.l2Provider);
    }
    async isTransactionRedeemed(l1TxHash, messageIndex = 0) {
        const status = await this.getMessageStatus(l1TxHash, messageIndex);
        return status === L1ToL2MessageStatus.REDEEMED;
    }
}
//# sourceMappingURL=ArbitrumRelayer.js.map