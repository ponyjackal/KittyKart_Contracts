// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IKittyKart {
  function ownerOf(uint256 tokenId) external view returns (address owner);

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes calldata data
  ) external;

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  ) external;
}
