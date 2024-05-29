"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonRelayer = void 0;
const sdk_1 = require("@hop-protocol/sdk");
const maticjs_fxportal_1 = require("@fxportal/maticjs-fxportal");
const maticjs_ethers_1 = require("@maticnetwork/maticjs-ethers");
const ethers_1 = require("ethers");
const maticjs_1 = require("@maticnetwork/maticjs");
class PolygonRelayer {
    constructor(network = 'mainnet', l1Provider, l2Provider) {
        this.ready = false;
        this.network = network;
        this.l1Provider = l1Provider;
        this.l2Provider = l2Provider;
        this.apiUrl = `https://apis.matic.network/api/v1/${this.network === 'mainnet' ? 'matic' : 'mumbai'}/block-included`;
        (0, maticjs_1.use)(maticjs_ethers_1.Web3ClientPlugin);
        (0, maticjs_1.setProofApi)('https://apis.matic.network');
        this.maticClient = new maticjs_fxportal_1.FxPortalClient();
        this.init()
            .catch((err) => {
            console.error('matic client initialize error:', err);
        });
    }
    async init() {
        const from = ''; // sender address
        const rootTunnel = ''; // l1FxBaseRootTunnel address
        await this.maticClient.init({
            network: this.network === 'mainnet' ? 'mainnet' : 'testnet',
            version: this.network === 'mainnet' ? 'v1' : 'mumbai',
            parent: {
                provider: this.l1Provider,
                defaultConfig: {
                    from
                }
            },
            child: {
                provider: this.l2Provider,
                defaultConfig: {
                    from
                }
            },
            erc20: {
                rootTunnel
            }
        });
        this.ready = true;
    }
    async tilReady() {
        if (this.ready) {
            return true;
        }
        await (0, sdk_1.wait)(100);
        return this.tilReady();
    }
    async getExitPopulatedTx(l2TxHash) {
        await this.tilReady();
        const commitTx = await this.l2Provider.getTransaction(l2TxHash);
        const isCheckpointed = await this.isCheckpointed(commitTx.blockNumber);
        if (!isCheckpointed) {
            throw new Error('tx not checkpointed');
        }
        // TODO: get populated tx only
        const tx = await this.maticClient.erc20(ethers_1.constants.AddressZero, true).withdrawExitFaster(l2TxHash);
        const p = tx.promise;
        if (!p) {
            throw new Error('no tx exists');
        }
        return p;
    }
    async isCheckpointed(l2BlockNumber) {
        const url = `${this.apiUrl}/${l2BlockNumber}`;
        const res = await fetch(url);
        const json = await res.json();
        return json.message === 'success';
    }
}
exports.PolygonRelayer = PolygonRelayer;
//# sourceMappingURL=PolygonRelayer.js.map