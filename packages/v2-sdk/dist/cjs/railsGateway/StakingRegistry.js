"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingRegistry = void 0;
const index_js_1 = require("#common/index.js");
const ethers_1 = require("ethers");
const StakingRegistry__factory_js_1 = require("#contracts/factories/StakingRegistry__factory.js");
class StakingRegistry extends index_js_1.Base {
    constructor(input) {
        super({
            network: input.network,
            signer: input.signer,
            contractAddresses: input.contractAddresses,
        });
    }
    connect(signer) {
        return new StakingRegistry({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    getStakingRegistryAddress(chainId) {
        return this.getConfigAddress(chainId, 'railsGateway');
    }
    getStakingRegistryContract(chainId) {
        const address = this.getStakingRegistryAddress(chainId);
        const provider = this.getRpcProviderForChainId(chainId);
        const contract = StakingRegistry__factory_js_1.StakingRegistry__factory.connect(address, provider);
        return contract;
    }
    async getChallengePeriod(chainId) {
        const contract = this.getStakingRegistryContract(chainId);
        return contract.challengePeriod();
    }
    async getAppealPeriod(chainId) {
        const contract = this.getStakingRegistryContract(chainId);
        return contract.appealPeriod();
    }
    async getMinChallengeIncrease(chainId) {
        const contract = this.getStakingRegistryContract(chainId);
        return contract.minChallengeIncrease();
    }
    async getFullAppeal(chainId) {
        const contract = this.getStakingRegistryContract(chainId);
        return contract.fullAppeal();
    }
    async getMinHopStakeForRole(input) {
        const { chainId, role } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.minHopStakeForRole(role);
    }
    async getChallenges(input) {
        const { chainId, challengeId } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.getChallenges(challengeId);
    }
    async getWithdrawableEth(input) {
        const { chainId, address } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.getWithdrawableEth(address);
    }
    async registryStakeHopPopulatedTx(input) {
        const { chainId, role, staker } = input;
        const contract = this.getStakingRegistryContract(chainId);
        const txData = await contract.populateTransaction.stakeHop(role, staker);
        return txData;
    }
    async registryUnstakeHopPopulatedTx(input) {
        const { chainId, role, amount } = input;
        const contract = this.getStakingRegistryContract(chainId);
        const txData = await contract.populateTransaction.unstakeHop(role, amount);
        return txData;
    }
    async registryWithdrawPopulatedTx(input) {
        const { chainId, role, staker } = input;
        const contract = this.getStakingRegistryContract(chainId);
        const txData = await contract.populateTransaction.withdraw(role, staker);
        return txData;
    }
    async registryStakeHop(input) {
        const populatedTx = await this.registryStakeHopPopulatedTx(input);
        return this.sendTransaction(populatedTx);
    }
    async registryUnstakeHop(input) {
        const populatedTx = await this.registryUnstakeHopPopulatedTx(input);
        return this.sendTransaction(populatedTx);
    }
    async registryWithdraw(input) {
        const populatedTx = await this.registryWithdrawPopulatedTx(input);
        return this.sendTransaction(populatedTx);
    }
    async createChallenge(input) {
        const { chainId, staker, role, penalty, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.createChallenge(staker, role, penalty, slashingData, { value: input.challengeEth });
    }
    async addToChallenge(input) {
        const { chainId, staker, challenger, role, penalty, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.addToChallenge(staker, challenger, role, penalty, slashingData, { value: input.additionalEth });
    }
    async addToAppeal(input) {
        const { chainId, staker, challenger, role, penalty, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.addToAppeal(staker, challenger, role, penalty, slashingData, { value: input.appealEth });
    }
    async optimisticallySettleChallenge(input) {
        const { chainId, staker, challenger, role, penalty, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.optimisticallySettleChallenge(staker, challenger, role, penalty, slashingData);
    }
    async acceptSlash(input) {
        const { chainId, challenger, role, penalty, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.acceptSlash(challenger, role, penalty, slashingData, { value: input.slashEth });
    }
    async forceSettleChallenge(input) {
        const { chainId, challengeId, challengeWon } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.forceSettleChallenge(challengeId, challengeWon);
    }
    async isStaked(input) {
        const { chainId, role, staker } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.isStaked(role, staker);
    }
    async getStakedBalance(input) {
        const { chainId, role, staker } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.getStakedBalance(role, staker);
    }
    async getWithdrawableStakeBalance(input) {
        const { chainId, role, staker } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.getWithdrawableBalance(role, staker);
    }
    // Helper function to calculate challengeId which would typically be calculated off-chain
    async getChallengeId(input) {
        const { chainId, role, staker, penalty, challenger, slashingData } = input;
        const contract = this.getStakingRegistryContract(chainId);
        return contract.getChallengeId(role, staker, penalty, challenger, slashingData);
    }
    // Helper function to encode role name into bytes32
    // This would typically not be part of the contract, but is included for completeness
    async getRoleForRoleName(roleName) {
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.toUtf8Bytes(roleName));
    }
}
exports.StakingRegistry = StakingRegistry;
//# sourceMappingURL=StakingRegistry.js.map