import { Chain, Token, Transfer } from './models'
import { TChain, TAmount } from './types'

class Base {
	toChainModel(chain: TChain) {
		if (typeof chain === 'string') {
			return Chain.fromSlug(chain)
		}

		return chain
	}
}

export default Base
