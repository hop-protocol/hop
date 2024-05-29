"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RailsGateway_instances, _RailsGateway_getWithdrawableBalance;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RailsGateway = void 0;
const ethers_1 = require("ethers");
const ERC20__factory_js_1 = require("#contracts/factories/ERC20__factory.js");
const RailsGateway__factory_js_1 = require("#contracts/factories/RailsGateway__factory.js");
const StakingRegistry_js_1 = require("./StakingRegistry.js");
const TransferSent_js_1 = require("#railsGateway/events/TransferSent.js");
const TransferBonded_js_1 = require("#railsGateway/events/TransferBonded.js");
const index_js_1 = require("#error/index.js");
const { getAddress: checksumAddress } = ethers_1.utils;
class RailsGateway extends StakingRegistry_js_1.StakingRegistry {
    constructor(input) {
        const { network, signer, contractAddresses } = input;
        super({
            network,
            signer,
            contractAddresses
        });
        _RailsGateway_instances.add(this);
        this.batchBlocks = 1000;
    }
    connect(signer) {
        return new RailsGateway({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    async getTransferSentEvents(input) {
        let { chainId, fromBlock, toBlock } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new index_js_1.InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
            throw new index_js_1.InputError(`Invalid fromBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const latestBlock = await provider.getBlockNumber();
        if (latestBlock) {
            if (!toBlock) {
                toBlock = latestBlock;
            }
            if (!fromBlock) {
                const start = latestBlock - 1000;
                fromBlock = start;
            }
            if (toBlock && fromBlock < 0) {
                fromBlock = toBlock + fromBlock;
            }
        }
        const address = this.getRailsGatewayContractAddress(chainId);
        const eventFetcher = new TransferSent_js_1.TransferSentEventFetcher(provider, chainId, 0, address);
        const events = await eventFetcher.getEvents(fromBlock, toBlock);
        return events;
    }
    async getTransferBondedEvents(input) {
        let { chainId, fromBlock, toBlock } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new index_js_1.InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (!this.utils.isValidFilterBlock(toBlock)) {
            throw new index_js_1.InputError(`Invalid fromBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const latestBlock = await provider.getBlockNumber();
        if (latestBlock) {
            if (!toBlock) {
                toBlock = latestBlock;
            }
            if (!fromBlock) {
                const start = latestBlock - 1000;
                fromBlock = start;
            }
            if (toBlock && fromBlock < 0) {
                fromBlock = toBlock + fromBlock;
            }
        }
        const address = this.getRailsGatewayContractAddress(chainId);
        const eventFetcher = new TransferBonded_js_1.TransferBondedEventFetcher(provider, chainId, 0, address);
        const events = await eventFetcher.getEvents(fromBlock, toBlock);
        return events;
    }
    getRailsGatewayContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        return this.getConfigAddress(chainId, 'railsGateway');
    }
    async getRailsGatewayContract(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(chainId);
        const provider = this.getRpcProviderForChainId(chainId);
        const contract = RailsGateway__factory_js_1.RailsGateway__factory.connect(address, provider);
        return contract;
    }
    async getPathId(input) {
        const { chainId0, token0, chainId1, token1 } = input;
        if (!this.utils.isValidChainId(chainId0)) {
            throw new index_js_1.InputError(`Invalid chainId0 "${chainId0}"`);
        }
        if (!this.utils.isValidAddress(token0)) {
            throw new index_js_1.InputError(`Invalid token0 "${token0}"`);
        }
        if (!this.utils.isValidAddress(token1)) {
            throw new index_js_1.InputError(`Invalid token1 "${token1}"`);
        }
        if (!this.utils.isValidChainId(chainId1)) {
            throw new index_js_1.InputError(`Invalid chainId1 "${chainId1}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId0);
        const pathId = await contract.getPathId(chainId0, token0, chainId1, token1);
        console.log('getPathId', pathId, { chainId0, token0, chainId1, token1 });
        return pathId;
    }
    async getPathInfo(input) {
        const { chainId, pathId } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        const pathInfoArray = await contract.getPathInfo(pathId);
        const pathInfo = {
            pathId,
            chainId: ethers_1.BigNumber.from(pathInfoArray[0]),
            token: checksumAddress(pathInfoArray[1]),
            counterpartChainId: ethers_1.BigNumber.from(pathInfoArray[2]),
            counterpartToken: checksumAddress(pathInfoArray[3])
        };
        // TODO: look into why same chainId is returned for counterpartChainId
        if (pathInfo.counterpartToken === '0xaCa72C8D5360dC237001cD963566F411732980B0' && pathInfo.counterpartChainId.eq(pathInfo.chainId)) {
            pathInfo.counterpartChainId = ethers_1.BigNumber.from(11155420);
        }
        if (pathInfo.counterpartToken === '0x5fd84259d66Cd46123540766Be93DFE6D43130D7' && pathInfo.counterpartChainId.eq(pathInfo.chainId)) {
            pathInfo.counterpartChainId = ethers_1.BigNumber.from(11155420);
        }
        if (!(this.utils.isValidAddress(pathInfo.token) && this.utils.isValidAddress(pathInfo.counterpartToken))) {
            throw new index_js_1.InputError('pathId is invalid or not found');
        }
        console.log('pathInfo', pathInfo);
        return pathInfo;
    }
    async getFee(input) {
        const { chainId, pathId } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        return contract.getFee(pathId);
    }
    get populateTransaction() {
        return {
            send: async (input) => {
                const { chainId, pathId, amount, minAmountOut, attestedCheckpoint } = input;
                let { to } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidNumericValue(minAmountOut)) {
                    throw new index_js_1.InputError(`Invalid minAmountOut "${to}"`);
                }
                if (!this.utils.isValidBytes32(attestedCheckpoint)) {
                    throw new index_js_1.InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`);
                }
                if (!to) {
                    to = (await this.getSignerAddress());
                }
                if (!this.utils.isValidAddress(to)) {
                    throw new index_js_1.InputError(`Invalid "to" address "${to}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const fee = await this.getFee({ chainId, pathId });
                const txData = await contract.populateTransaction.send(pathId, to, amount, minAmountOut, attestedCheckpoint, {
                    value: fee
                });
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            approveSend: async (input) => {
                const { chainId, pathId, amount } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                const path = await this.getPathInfo({ chainId, pathId });
                const tokenAddress = path.token;
                const provider = this.getRpcProviderForChainId(chainId);
                const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
                const address = this.getRailsGatewayContractAddress(chainId);
                const txData = await tokenContract.populateTransaction.approve(address, amount);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            bond: async (input) => {
                const { chainId, pathId, checkpoint, to, amount, totalSent, nonce, attestedCheckpoint } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidBytes32(checkpoint)) {
                    throw new index_js_1.InputError(`Invalid checkpoint "${checkpoint}"`);
                }
                if (!this.utils.isValidAddress(to)) {
                    throw new index_js_1.InputError(`Invalid to address "${to}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                if (!this.utils.isValidNumericValue(totalSent)) {
                    throw new index_js_1.InputError(`Invalid amount "${totalSent}"`);
                }
                if (!this.utils.isValidBytes32(attestedCheckpoint)) {
                    throw new index_js_1.InputError(`Invalid attested checkpoint "${attestedCheckpoint}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.populateTransaction.bond(pathId, checkpoint, to, amount, totalSent, nonce, attestedCheckpoint);
                return {
                    ...txData,
                    chainId: Number(chainId),
                };
            },
            approveBond: async (input) => {
                const { chainId, pathId, amount } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                const path = await this.getPathInfo({ chainId, pathId });
                const tokenAddress = path.token;
                const provider = this.getRpcProviderForChainId(chainId);
                const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
                const address = this.getRailsGatewayContractAddress(chainId);
                const txData = await tokenContract.populateTransaction.approve(address, amount);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            postClaim: async (input) => {
                const { chainId, pathId, transferId, head, totalSent } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidBytes32(transferId)) {
                    throw new index_js_1.InputError(`Invalid transferId "${transferId}"`);
                }
                if (!this.utils.isValidBytes32(head)) {
                    throw new index_js_1.InputError(`Invalid head "${head}"`);
                }
                if (!this.utils.isValidNumericValue(totalSent)) {
                    throw new index_js_1.InputError(`Invalid head "${totalSent}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.populateTransaction.postClaim(pathId, transferId, head, totalSent);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            removeClaim: async (input) => {
                const { chainId, pathId, checkpoint, nonce } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidBytes32(checkpoint)) {
                    throw new index_js_1.InputError(`Invalid checkpoint "${checkpoint}"`);
                }
                if (!this.utils.isValidNumericValue(nonce)) {
                    throw new index_js_1.InputError(`Invalid nonce "${nonce}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.populateTransaction.removeClaim(pathId, checkpoint, nonce);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            withdrawClaim: async (input) => {
                const { chainId, pathId, amount, timeWindow } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                if (!this.utils.isValidNumericValue(timeWindow)) {
                    throw new index_js_1.InputError(`Invalid timeWindow "${timeWindow}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.populateTransaction.withdraw(pathId, amount, timeWindow);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            withdrawAllClaims: async (input) => {
                const { chainId, pathId, timeWindow } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidNumericValue(timeWindow)) {
                    throw new index_js_1.InputError(`Invalid timeWindow "${timeWindow}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.withdrawAll(pathId, timeWindow);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            confirmCheckpoint: async (input) => {
                const { chainId, pathId, checkpoint } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(pathId)) {
                    throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
                }
                if (!this.utils.isValidBytes32(checkpoint)) {
                    throw new index_js_1.InputError(`Invalid checkpoint "${checkpoint}"`);
                }
                const contract = await this.getRailsGatewayContract(chainId);
                const txData = await contract.populateTransaction.confirmCheckpoint(pathId, checkpoint);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            approveStakeHop: async (input) => {
                let { chainId, role, staker, amount } = input;
                if (!staker) {
                    staker = (await this.getSignerAddress());
                }
                if (!staker) {
                    throw new index_js_1.InputError('Staker address not set');
                }
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(role)) {
                    throw new index_js_1.InputError(`Invalid role "${role}"`);
                }
                if (!this.utils.isValidAddress(staker)) {
                    throw new index_js_1.InputError(`Invalid staker "${staker}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                const hopTokenContract = await this.getHopTokenContract(chainId);
                const address = this.getRailsGatewayContractAddress(chainId);
                const txData = await hopTokenContract.populateTransaction.approve(address, amount);
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            stakeHop: async (input) => {
                let { chainId, role, staker, amount } = input;
                if (!staker) {
                    staker = (await this.getSignerAddress());
                }
                if (!staker) {
                    throw new index_js_1.InputError('Staker address not set');
                }
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(role)) {
                    throw new index_js_1.InputError(`Invalid role "${role}"`);
                }
                if (!this.utils.isValidAddress(staker)) {
                    throw new index_js_1.InputError(`Invalid staker "${staker}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                const minRequired = await this.getMinHopStakeForRole({ chainId, role });
                const balance = await this.getHopBalance(chainId, staker);
                if (balance.lt(amount)) {
                    throw new index_js_1.InsufficientBalanceError(`Insufficient balance to stake ${amount.toString()} HOP`);
                }
                const hopTokenContract = await this.getHopTokenContract(chainId);
                if (balance.lt(minRequired)) {
                    throw new index_js_1.InsufficientBalanceError(`Insufficient balance to stake ${minRequired.toString()} HOP`);
                }
                const txData = await this.registryStakeHopPopulatedTx({ chainId, role, staker, amount });
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            unstakeHop: async (input) => {
                const { chainId, role, amount } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(role)) {
                    throw new index_js_1.InputError(`Invalid role "${role}"`);
                }
                if (!this.utils.isValidNumericValue(amount)) {
                    throw new index_js_1.InputError(`Invalid amount "${amount}"`);
                }
                const staker = await this.getSignerAddress();
                if (!staker) {
                    throw new index_js_1.InputError('Staker address not set');
                }
                const balance = await this.getWithdrawableStakeBalance({ chainId, role, staker });
                if (balance.lt(amount)) {
                    throw new index_js_1.InsufficientBalanceError('Insufficient balance to unstake');
                }
                const txData = await this.registryUnstakeHopPopulatedTx({ chainId, role, amount });
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            },
            withdrawHop: async (input) => {
                const { chainId, role } = input;
                if (!this.utils.isValidChainId(chainId)) {
                    throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidBytes32(role)) {
                    throw new index_js_1.InputError(`Invalid role "${role}"`);
                }
                const staker = await this.getSignerAddress();
                if (!staker) {
                    throw new index_js_1.InputError('Staker address not set');
                }
                const txData = await this.registryWithdrawPopulatedTx({ chainId, role, staker });
                return {
                    ...txData,
                    chainId: Number(chainId)
                };
            }
        };
    }
    async send(input) {
        const { chainId, pathId, amount } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        if (!this.utils.isValidNumericValue(amount)) {
            throw new index_js_1.InputError(`Invalid amount "${amount}"`);
        }
        const path = await this.getPathInfo({ chainId, pathId });
        const tokenAddress = path.token;
        const provider = this.getRpcProviderForChainId(chainId);
        const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
        const signerAddress = (await this.getSignerAddress());
        const balance = await tokenContract.balanceOf(signerAddress);
        if (balance.lt(amount)) {
            throw new index_js_1.InsufficientBalanceError('Insufficient balance ');
        }
        const address = this.getRailsGatewayContractAddress(chainId);
        const approved = await tokenContract.allowance(signerAddress, address);
        if (approved.lt(amount)) {
            throw new index_js_1.InsufficientApprovalError('Insufficient approval');
        }
        const populatedTx = await this.populateTransaction.send(input);
        const tx = await this.sendTransaction(populatedTx);
        return tx;
    }
    async approveSend(input) {
        const txData = await this.populateTransaction.approveSend(input);
        return this.sendTransaction(txData);
    }
    async bond(input) {
        const { chainId, pathId, amount } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        if (!this.utils.isValidNumericValue(amount)) {
            throw new index_js_1.InputError(`Invalid amount "${amount}"`);
        }
        const path = await this.getPathInfo({ chainId, pathId });
        const tokenAddress = path.token;
        const provider = this.getRpcProviderForChainId(chainId);
        const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
        const signerAddress = (await this.getSignerAddress());
        const balance = await tokenContract.balanceOf(signerAddress);
        if (balance.lt(amount)) {
            throw new index_js_1.InsufficientBalanceError('Insufficient balance');
        }
        const address = this.getRailsGatewayContractAddress(chainId);
        const approved = await tokenContract.allowance(signerAddress, address);
        if (approved.lt(amount)) {
            throw new index_js_1.InsufficientApprovalError('Insufficient approval');
        }
        const populatedTx = await this.populateTransaction.bond(input);
        return this.sendTransaction(populatedTx);
    }
    async approveBond(input) {
        const txData = await this.populateTransaction.approveBond(input);
        return this.sendTransaction(txData);
    }
    async postClaim(input) {
        const populatedTx = await this.populateTransaction.postClaim(input);
        return this.sendTransaction(populatedTx);
    }
    async removeClaim(input) {
        const populatedTx = await this.populateTransaction.removeClaim(input);
        return this.sendTransaction(populatedTx);
    }
    async confirmCheckpoint(input) {
        const populatedTx = await this.populateTransaction.confirmCheckpoint(input);
        return this.sendTransaction(populatedTx);
    }
    async withdrawClaim(input) {
        const populatedTx = await this.populateTransaction.withdrawClaim(input);
        return this.sendTransaction(populatedTx);
    }
    async withdrawAllClaims(input) {
        const populatedTx = await this.populateTransaction.withdrawAllClaims(input);
        return this.sendTransaction(populatedTx);
    }
    async getNeedsApprovalForSend(input) {
        const { chainId, pathId, amount } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidNumericValue(amount)) {
            throw new index_js_1.InputError(`Invalid amount "${amount}"`);
        }
        const path = await this.getPathInfo({ chainId, pathId });
        const tokenAddress = path.token;
        const provider = this.getRpcProviderForChainId(chainId);
        console.log('rails approval token', tokenAddress);
        const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
        const spender = this.getRailsGatewayContractAddress(chainId);
        const account = await this.getSignerAddress();
        if (!account) {
            throw new index_js_1.InputError('signer not set');
        }
        console.log('rails approval account', account);
        console.log('rails approval spender', spender);
        const approved = await tokenContract.allowance(account, spender);
        return approved.lt(amount);
    }
    async getNeedsApprovalForBond(input) {
        const { chainId, pathId, amount } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidNumericValue(amount)) {
            throw new index_js_1.InputError(`Invalid amount "${amount}"`);
        }
        const path = await this.getPathInfo({ chainId, pathId });
        const tokenAddress = path.token;
        const provider = this.getRpcProviderForChainId(chainId);
        const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(tokenAddress, provider);
        const spender = this.getRailsGatewayContractAddress(chainId);
        const account = await this.getSignerAddress();
        if (!account) {
            throw new index_js_1.InputError('signer not set');
        }
        const approved = await tokenContract.allowance(account, spender);
        return approved.lt(amount);
    }
    async getLatestClaim(input) {
        const { chainId, pathId } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        return contract.getLatestClaim(pathId);
    }
    async getIsCheckpointValid(input) {
        const { chainId, pathId, checkpoint } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(checkpoint)) {
            throw new index_js_1.InputError(`Invalid checkpoint "${checkpoint}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        const valid = await contract.isCheckpointValid(pathId, checkpoint);
        return valid;
    }
    async stakeHop(input) {
        const populatedTx = await this.populateTransaction.stakeHop(input);
        return this.sendTransaction(populatedTx);
    }
    async unstakeHop(input) {
        const populatedTx = await this.populateTransaction.unstakeHop(input);
        return this.sendTransaction(populatedTx);
    }
    async withdrawHop(input) {
        const populatedTx = await this.populateTransaction.withdrawHop(input);
        return this.sendTransaction(populatedTx);
    }
    async getWithdrawableBalance(input) {
        const { chainId, pathId, recipient, timeWindow } = input;
        if (!pathId) {
            throw new index_js_1.InputError('pathId is required');
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidAddress(recipient)) {
            throw new index_js_1.InputError(`Invalid recipient "${recipient}"`);
        }
        if (!this.utils.isValidNumericValue(timeWindow)) {
            throw new index_js_1.InputError(`Invalid timeWindow "${timeWindow}"`);
        }
        const path = await this.getPathInfo({ chainId, pathId });
        return __classPrivateFieldGet(this, _RailsGateway_instances, "m", _RailsGateway_getWithdrawableBalance).call(this, { chainId, path, recipient, timeWindow });
    }
    async getTransferId(input) {
        const { chainId, pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidBytes32(pathId)) {
            throw new index_js_1.InputError(`Invalid pathId "${pathId}"`);
        }
        if (!this.utils.isValidAddress(to)) {
            throw new index_js_1.InputError(`Invalid to address "${to}"`);
        }
        if (!this.utils.isValidNumericValue(adjustedAmount)) {
            throw new index_js_1.InputError(`Invalid adjustedAmount "${adjustedAmount}"`);
        }
        if (!this.utils.isValidNumericValue(minAmountOut)) {
            throw new index_js_1.InputError(`Invalid minAmountOut "${to}"`);
        }
        if (!this.utils.isValidNumericValue(totalSent)) {
            throw new index_js_1.InputError(`Invalid totalSent "${totalSent}"`);
        }
        if (!this.utils.isValidNumericValue(nonce)) {
            throw new index_js_1.InputError(`Invalid nonce "${nonce}"`);
        }
        if (!this.utils.isValidBytes32(attestedCheckpoint)) {
            throw new index_js_1.InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        return contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint);
    }
    async getHopTokenAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        return contract.hopToken();
    }
    async getMinBonderStake(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        const contract = await this.getRailsGatewayContract(chainId);
        return contract.minBonderStake();
    }
    async getHopBalance(chainId, address) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!address) {
            address = await this.getSignerAddress();
        }
        if (!address) {
            throw new index_js_1.InputError('Address not set');
        }
        const contract = await this.getHopTokenContract(chainId);
        return contract.balanceOf(address);
    }
    async getHopTokenContract(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        const hopTokenAddress = await this.getHopTokenAddress(chainId);
        const provider = this.getRpcProviderForChainId(chainId);
        const contract = ERC20__factory_js_1.ERC20__factory.connect(hopTokenAddress, provider);
        return contract;
    }
    calcAmountOutMin(input) {
        let { amountOut, slippageTolerance } = input;
        if (!this.utils.isValidNumericValue(amountOut)) {
            throw new index_js_1.InputError(`Invalid amountOut "${amountOut}"`);
        }
        if (!this.utils.isValidNumericValue(slippageTolerance)) {
            throw new index_js_1.InputError(`Invalid slippageTolerance "${slippageTolerance}"`);
        }
        amountOut = ethers_1.BigNumber.from(amountOut.toString());
        const slippageToleranceBps = slippageTolerance * 100;
        const minBps = Math.ceil(10000 - slippageToleranceBps);
        return amountOut.mul(minBps).div(10000);
    }
    async getTransferSentEventFromTransactionReceipt(input) {
        const { fromChainId, receipt } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!receipt) {
            throw new index_js_1.InputError('receipt is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId: ${fromChainId}`);
        }
        const eventFetcher = new TransferSent_js_1.TransferSentEventFetcher(provider, fromChainId, this.batchBlocks, address);
        const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt);
        return events?.[0] ?? null;
    }
    async getTransferSentEventFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!transactionHash) {
            throw new index_js_1.InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new index_js_1.InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const receipt = await provider.getTransactionReceipt(transactionHash);
        if (!receipt) {
            return null;
        }
        return this.getTransferSentEventFromTransactionReceipt({ fromChainId, receipt });
    }
    async getTransferSentEventFromTransferId(input) {
        const { fromChainId, transferId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(transferId)) {
            throw new index_js_1.InputError(`Invalid transferId "${transferId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new TransferSent_js_1.TransferSentEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getTransferIdFilter(transferId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getTransferSentEventFromCheckpoint(input) {
        const { fromChainId, checkpoint } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(checkpoint)) {
            throw new index_js_1.InputError(`Invalid transferId "${checkpoint}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new TransferSent_js_1.TransferSentEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getCheckpointFilter(checkpoint);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getTransferBondedEventFromTransactionReceipt(input) {
        const { fromChainId, receipt } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!receipt) {
            throw new index_js_1.InputError('receipt is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId: ${fromChainId}`);
        }
        const eventFetcher = new TransferBonded_js_1.TransferBondedEventFetcher(provider, fromChainId, this.batchBlocks, address);
        const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt);
        return events?.[0] ?? null;
    }
    async getTransferBondedEventFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!transactionHash) {
            throw new index_js_1.InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new index_js_1.InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const receipt = await provider.getTransactionReceipt(transactionHash);
        if (!receipt) {
            return null;
        }
        return this.getTransferBondedEventFromTransactionReceipt({ fromChainId, receipt });
    }
    async getTransferBondedEventFromTransferId(input) {
        const { fromChainId, transferId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(transferId)) {
            throw new index_js_1.InputError(`Invalid transferId "${transferId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new TransferBonded_js_1.TransferBondedEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getTransferIdFilter(transferId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getTransferBondedEventFromCheckpoint(input) {
        const { fromChainId, checkpoint } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new index_js_1.InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(checkpoint)) {
            throw new index_js_1.InputError(`Invalid transferId "${checkpoint}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new index_js_1.ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getRailsGatewayContractAddress(fromChainId);
        if (!address) {
            throw new index_js_1.ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new TransferBonded_js_1.TransferBondedEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getCheckpointFilter(checkpoint);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getTokenInfo(input) {
        const { chainId, address } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidAddress(address)) {
            throw new index_js_1.InputError(`Invalid address "${address}"`);
        }
        const contract = this.getTokenContract({ chainId, address });
        return {
            chainId: ethers_1.BigNumber.from(chainId),
            address: checksumAddress(address),
            name: await contract.name(),
            symbol: await contract.symbol(),
            decimals: Number(await contract.decimals())
        };
    }
    getTokenContract(input) {
        if (!this.utils.isValidObject(input)) {
            throw new index_js_1.InputError('Invalid input, expected object');
        }
        const { chainId, address } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidAddress(address)) {
            throw new index_js_1.InputError(`Invalid address "${address}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        const tokenContract = ERC20__factory_js_1.ERC20__factory.connect(address, provider);
        return tokenContract;
    }
}
exports.RailsGateway = RailsGateway;
_RailsGateway_instances = new WeakSet(), _RailsGateway_getWithdrawableBalance = async function _RailsGateway_getWithdrawableBalance(input) {
    const { chainId, path, recipient, timeWindow } = input;
    if (!this.utils.isValidChainId(chainId)) {
        throw new index_js_1.InputError(`Invalid chainId "${chainId}"`);
    }
    if (!path) {
        throw new index_js_1.InputError('pathInfo not set');
    }
    if (!this.utils.isValidAddress(recipient)) {
        throw new index_js_1.InputError(`Invalid recipient "${recipient}"`);
    }
    if (!this.utils.isValidNumericValue(timeWindow)) {
        throw new index_js_1.InputError(`Invalid timeWindow "${timeWindow}"`);
    }
    const contract = await this.getRailsGatewayContract(chainId);
    return contract.getWithdrawableBalance(path, recipient, timeWindow);
};
//# sourceMappingURL=RailsGateway.js.map