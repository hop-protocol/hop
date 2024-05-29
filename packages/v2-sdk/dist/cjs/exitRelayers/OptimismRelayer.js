"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimismRelayer = void 0;
const sdk_1 = require("@hop-protocol/sdk");
const sdk_2 = require("@eth-optimism/sdk");
class OptimismRelayer {
    constructor(network = 'mainnet', l1Provider, l2Provider) {
        this.network = network;
        this.l1Provider = l1Provider;
        this.l2Provider = l2Provider;
        this.csm = new sdk_2.CrossChainMessenger({
            bedrock: true,
            l1ChainId: 5,
            l2ChainId: 420,
            l1SignerOrProvider: l1Provider,
            l2SignerOrProvider: l2Provider
        });
    }
    async getExitPopulatedTx(l2TxHash) {
        throw new Error('not implemented');
    }
    async getIsL2TxHashExited(l2TxHash) {
        const messageStatus = await this.csm.getMessageStatus(l2TxHash);
        if (messageStatus === sdk_2.MessageStatus.RELAYED) {
            return true;
        }
        return false;
    }
    async exitTx(l2TxHash) {
        let messageStatus = await this.csm.getMessageStatus(l2TxHash);
        if (messageStatus === sdk_2.MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
            console.log('waiting for state root to be published');
            // wait a max of 240 seconds for state root to be published on L1
            await (0, sdk_1.wait)(240 * 1000);
        }
        messageStatus = await this.csm.getMessageStatus(l2TxHash);
        if (messageStatus === sdk_2.MessageStatus.READY_TO_PROVE) {
            console.log('message ready to prove');
            const resolved = await this.csm.toCrossChainMessage(l2TxHash);
            console.log('sending proveMessage tx');
            const tx = await this.csm.proveMessage(resolved);
            console.log('proveMessage tx:', tx?.hash);
            await tx.wait();
            console.log('waiting challenge period');
            const challengePeriod = await this.csm.getChallengePeriodSeconds();
            await (0, sdk_1.wait)(challengePeriod * 1000);
        }
        messageStatus = await this.csm.getMessageStatus(l2TxHash);
        if (messageStatus === sdk_2.MessageStatus.IN_CHALLENGE_PERIOD) {
            console.log('message is in challenge period');
            // challenge period is a few seconds on testnet, 7 days in production
            const challengePeriod = await this.csm.getChallengePeriodSeconds();
            const latestBlock = await this.csm.l1Provider.getBlock('latest');
            const resolved = await this.csm.toCrossChainMessage(l2TxHash);
            const withdrawal = await this.csm.toLowLevelMessage(resolved);
            const provenWithdrawal = await this.csm.contracts.l1.OptimismPortal.provenWithdrawals((0, sdk_2.hashLowLevelMessage)(withdrawal));
            const timestamp = Number(provenWithdrawal.timestamp.toString());
            const bufferSeconds = 10;
            const secondsLeft = (timestamp + challengePeriod + bufferSeconds) - Number(latestBlock.timestamp.toString());
            console.log('seconds left:', secondsLeft);
            await (0, sdk_1.wait)(secondsLeft * 1000);
        }
        messageStatus = await this.csm.getMessageStatus(l2TxHash);
        if (messageStatus === sdk_2.MessageStatus.READY_FOR_RELAY) {
            console.log('ready for relay');
            console.log('sending finalizeMessage tx');
            const tx = await this.csm.finalizeMessage(l2TxHash);
            console.log('finalizeMessage tx:', tx.hash);
            return tx;
        }
        if (messageStatus === sdk_2.MessageStatus.RELAYED) {
            throw new Error('message already relayed');
        }
        console.log(sdk_2.MessageStatus);
        throw new Error(`not ready for relay. statusCode: ${messageStatus}`);
    }
    formatError(err) {
        const isNotCheckpointedYet = err.message.includes('unable to find state root batch for tx');
        const isProofNotFound = err.message.includes('messagePairs not found');
        const isInsideFraudProofWindow = err.message.includes('exit within challenge window');
        const notReadyForExit = isNotCheckpointedYet || isProofNotFound || isInsideFraudProofWindow;
        if (notReadyForExit) {
            throw new Error('too early to exit');
        }
        const isAlreadyRelayed = err.message.includes('message has already been received');
        if (isAlreadyRelayed) {
            throw new Error('message has already been relayed');
        }
        // isEventLow() does not handle the case where `batchEvents` is null
        // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
        const cannotReadProperty = err.message.includes('Cannot read property');
        if (cannotReadProperty) {
            throw new Error('event not found in optimism sdk');
        }
        throw err;
    }
}
exports.OptimismRelayer = OptimismRelayer;
//# sourceMappingURL=OptimismRelayer.js.map