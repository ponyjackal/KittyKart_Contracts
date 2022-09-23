// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IKittyKartMarketplace {
  function list(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _price
  ) external;

  function listNFT(uint256 _tokenId, address _owner) external;

  function buyNFT(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _amount
  ) external;

  function offer(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _amount
  ) external;

  function sellNFT(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _amount
  ) external;
}
