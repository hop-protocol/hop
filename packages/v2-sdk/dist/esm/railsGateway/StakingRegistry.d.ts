import { Base, BaseConfig } from '#common/index.js';
import { Contract, Signer, ethers, BigNumberish } from 'ethers';
export type MinHopStakeForRoleInput = {
    chainId: BigNumberish;
    role: string;
};
export type GetChallengesInput = {
    chainId: BigNumberish;
    challengeId: string;
};
export type GetWithdrawableEthInput = {
    chainId: BigNumberish;
    address: string;
};
export type RegistryStakeHopInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
    amount: BigNumberish;
};
export type RegistryUnstakeHopInput = {
    chainId: BigNumberish;
    role: string;
    amount: ethers.BigNumberish;
};
export type RegistryWithdrawInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
};
export type CreateChallengeInput = {
    chainId: BigNumberish;
    staker: string;
    role: string;
    penalty: BigNumberish;
    slashingData: string;
    challengeEth: BigNumberish;
};
export type AddToChallengeInput = {
    chainId: BigNumberish;
    staker: string;
    challenger: string;
    role: string;
    penalty: BigNumberish;
    slashingData: string;
    additionalEth: BigNumberish;
};
export type AddToAppealInput = {
    chainId: BigNumberish;
    staker: string;
    challenger: string;
    role: string;
    penalty: BigNumberish;
    slashingData: string;
    appealEth: BigNumberish;
};
export type OptimisticallySettleChallengeInput = {
    chainId: BigNumberish;
    staker: string;
    challenger: string;
    role: string;
    penalty: ethers.BigNumberish;
    slashingData: string;
};
export type AcceptSlashInput = {
    chainId: BigNumberish;
    challenger: string;
    role: string;
    penalty: BigNumberish;
    slashingData: string;
    slashEth: BigNumberish;
};
export type ForceSettleChallengeInput = {
    chainId: BigNumberish;
    challengeId: string;
    challengeWon: boolean;
};
export type IsStakedInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
};
export type GetStakedBalanceInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
};
export type GetWithdrawableBalanceInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
};
export type GetChallengeIdInput = {
    chainId: BigNumberish;
    role: string;
    staker: string;
    penalty: BigNumberish;
    challenger: string;
    slashingData: string;
};
export type StakingRegistryConstructorInput = BaseConfig;
export declare class StakingRegistry extends Base {
    constructor(input: StakingRegistryConstructorInput);
    connect(signer: Signer): StakingRegistry;
    getStakingRegistryAddress(chainId: BigNumberish): string;
    getStakingRegistryContract(chainId: BigNumberish): Contract;
    getChallengePeriod(chainId: BigNumberish): Promise<any>;
    getAppealPeriod(chainId: BigNumberish): Promise<any>;
    getMinChallengeIncrease(chainId: BigNumberish): Promise<any>;
    getFullAppeal(chainId: BigNumberish): Promise<any>;
    getMinHopStakeForRole(input: MinHopStakeForRoleInput): Promise<any>;
    getChallenges(input: GetChallengesInput): Promise<any>;
    getWithdrawableEth(input: GetWithdrawableEthInput): Promise<any>;
    registryStakeHopPopulatedTx(input: RegistryStakeHopInput): Promise<ethers.PopulatedTransaction>;
    registryUnstakeHopPopulatedTx(input: RegistryUnstakeHopInput): Promise<ethers.PopulatedTransaction>;
    registryWithdrawPopulatedTx(input: RegistryWithdrawInput): Promise<ethers.PopulatedTransaction>;
    registryStakeHop(input: RegistryStakeHopInput): Promise<ethers.providers.TransactionResponse>;
    registryUnstakeHop(input: RegistryUnstakeHopInput): Promise<ethers.providers.TransactionResponse>;
    registryWithdraw(input: RegistryWithdrawInput): Promise<ethers.providers.TransactionResponse>;
    createChallenge(input: CreateChallengeInput): Promise<any>;
    addToChallenge(input: AddToChallengeInput): Promise<any>;
    addToAppeal(input: AddToAppealInput): Promise<any>;
    optimisticallySettleChallenge(input: OptimisticallySettleChallengeInput): Promise<any>;
    acceptSlash(input: AcceptSlashInput): Promise<any>;
    forceSettleChallenge(input: ForceSettleChallengeInput): Promise<any>;
    isStaked(input: IsStakedInput): Promise<any>;
    getStakedBalance(input: GetStakedBalanceInput): Promise<any>;
    getWithdrawableStakeBalance(input: GetWithdrawableBalanceInput): Promise<any>;
    getChallengeId(input: GetChallengeIdInput): Promise<any>;
    getRoleForRoleName(roleName: string): Promise<string>;
}
//# sourceMappingURL=StakingRegistry.d.ts.map