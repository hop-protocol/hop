// SPDX-License-Identifier: Apache-2.0

/*
 * Copyright 2019-2020, Offchain Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

pragma solidity ^0.5.11;

import "../interfaces/IERC721.sol";

contract GlobalNFTWallet {
    struct NFTWallet {
        address contractAddress;
        mapping(uint256 => uint256) tokenIndex;
        uint256[] tokenList;
    }

    struct UserNFTWallet {
        mapping(address => uint256) nftWalletIndex;
        NFTWallet[] nftWalletList;
    }

    mapping(address => UserNFTWallet) private nftWallets;

    function ownedERC721s(address _owner) external view returns (address[] memory) {
        UserNFTWallet storage wallet = nftWallets[_owner];
        address[] memory addresses = new address[](wallet.nftWalletList.length);
        uint256 addressCount = addresses.length;
        for (uint256 i = 0; i < addressCount; i++) {
            addresses[i] = wallet.nftWalletList[i].contractAddress;
        }
        return addresses;
    }

    function getERC721Tokens(address _erc721, address _owner)
        external
        view
        returns (uint256[] memory)
    {
        UserNFTWallet storage wallet = nftWallets[_owner];
        uint256 index = wallet.nftWalletIndex[_erc721];
        if (index == 0) {
            return new uint256[](0);
        }
        return wallet.nftWalletList[index - 1].tokenList;
    }

    function hasERC721(
        address _erc721,
        address _owner,
        uint256 _tokenId
    ) external view returns (bool) {
        UserNFTWallet storage wallet = nftWallets[_owner];
        uint256 index = wallet.nftWalletIndex[_erc721];
        if (index == 0) {
            return false;
        }
        return wallet.nftWalletList[index - 1].tokenIndex[_tokenId] != 0;
    }

    function withdrawERC721(address _erc721, uint256 _tokenId) external {
        require(removeNFTToken(msg.sender, _erc721, _tokenId), "Wallet doesn't own token");
        IERC721(_erc721).safeTransferFrom(address(this), msg.sender, _tokenId);
    }

    function depositERC721(
        address _erc721,
        address _destination,
        uint256 _tokenId
    ) internal {
        IERC721(_erc721).transferFrom(msg.sender, address(this), _tokenId);
        addNFTToken(_destination, _erc721, _tokenId);
    }

    function transferNFT(
        address _from,
        address _to,
        address _erc721,
        uint256 _tokenId
    ) internal returns (bool) {
        if (!removeNFTToken(_from, _erc721, _tokenId)) {
            return false;
        }
        addNFTToken(_to, _erc721, _tokenId);
        return true;
    }

    function addNFTToken(
        address _user,
        address _erc721,
        uint256 _tokenId
    ) private {
        UserNFTWallet storage wallet = nftWallets[_user];
        uint256 index = wallet.nftWalletIndex[_erc721];
        if (index == 0) {
            index = wallet.nftWalletList.push(NFTWallet(_erc721, new uint256[](0)));
            wallet.nftWalletIndex[_erc721] = index;
        }
        NFTWallet storage nftWallet = wallet.nftWalletList[index - 1];
        require(nftWallet.tokenIndex[_tokenId] == 0, "can't add already owned token");
        nftWallet.tokenList.push(_tokenId);
        nftWallet.tokenIndex[_tokenId] = nftWallet.tokenList.length;
    }

    function removeNFTToken(
        address _user,
        address _erc721,
        uint256 _tokenId
    ) private returns (bool) {
        UserNFTWallet storage wallet = nftWallets[_user];
        uint256 walletIndex = wallet.nftWalletIndex[_erc721];
        if (walletIndex == 0) {
            // Wallet has no coins from given NFT contract
            return false;
        }
        NFTWallet storage nftWallet = wallet.nftWalletList[walletIndex - 1];
        uint256 tokenIndex = nftWallet.tokenIndex[_tokenId];
        if (tokenIndex == 0) {
            // Wallet does not own specific NFT
            return false;
        }
        nftWallet.tokenIndex[nftWallet.tokenList[nftWallet.tokenList.length - 1]] = tokenIndex;
        nftWallet.tokenList[tokenIndex - 1] = nftWallet.tokenList[nftWallet.tokenList.length - 1];
        delete nftWallet.tokenIndex[_tokenId];
        nftWallet.tokenList.pop();
        if (nftWallet.tokenList.length == 0) {
            wallet.nftWalletIndex[wallet.nftWalletList[wallet.nftWalletList.length - 1]
                .contractAddress] = walletIndex;
            wallet.nftWalletList[walletIndex - 1] = wallet.nftWalletList[wallet
                .nftWalletList
                .length - 1];
            delete wallet.nftWalletIndex[_erc721];
            wallet.nftWalletList.pop();
        }
        return true;
    }
}
