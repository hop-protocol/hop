import { wait } from '@hop-protocol/sdk';
import { FxPortalClient } from '@fxportal/maticjs-fxportal';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import { constants } from 'ethers';
import { setProofApi, use } from '@maticnetwork/maticjs';
export class PolygonRelayer {
    constructor(network = 'mainnet', l1Provider, l2Provider) {
        this.ready = false;
        this.network = network;
        this.l1Provider = l1Provider;
        this.l2Provider = l2Provider;
        this.apiUrl = `https://apis.matic.network/api/v1/${this.network === 'mainnet' ? 'matic' : 'mumbai'}/block-included`;
        use(Web3ClientPlugin);
        setProofApi('https://apis.matic.network');
        this.maticClient = new FxPortalClient();
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
        await wait(100);
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
        const tx = await this.maticClient.erc20(constants.AddressZero, true).withdrawExitFaster(l2TxHash);
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
//# sourceMappingURL=PolygonRelayer.js.map