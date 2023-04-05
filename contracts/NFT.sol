// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol
    ) ERC721(_tokenName, _tokenSymbol) {}

    function mint(string calldata _tokenURI) public onlyOwner {
        _mintTo(_msgSender(), _tokenURI);
    }

    function mintTo(
        address _toAddress,
        string calldata _tokenURI
    ) public onlyOwner {
        _mintTo(_toAddress, _tokenURI);
    }

    function burn(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == _msgSender(), "Only owner of token");
        _burn(_tokenId);
    }

    function _mintTo(address _toAddress, string calldata _tokenURI) internal {
        _tokenIds.increment();
        uint256 _tokenId = _tokenIds.current();
        _safeMint(_toAddress, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }

    function getCurrentId() public view returns (uint256) {
        return _tokenIds.current();
    }
}
