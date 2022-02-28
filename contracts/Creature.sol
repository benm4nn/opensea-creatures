// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title Creature
 * Creature - a contract for my NFT.
 */
contract Creature is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Krazy Phace", "KRZP", _proxyRegistryAddress)
    {}

    function baseTokenURI() override public pure returns (string memory) {
        return "https://krazyphaces.herokuapp.com/api/token/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://krazyphaces.herokuapp.com/api/collection";
    }
}
