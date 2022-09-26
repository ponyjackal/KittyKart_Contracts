// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IKittyKartMarketplace {
  // -----------------------------------------
  // KittyKartGoKart Events
  // -----------------------------------------
  event NFTListed(address indexed tokenContract, uint256 indexed tokenId, address indexed seller, uint256 price);
  event NFTSold(address indexed tokenContract, uint256 indexed tokenId, address seller, address buyer, uint256 price);
  event OfferMade(address indexed tokenContract, uint256 indexed tokenId, address indexed buyer, uint256 price);

  struct NFT {
    address nftContract;
    uint256 tokenId;
    address seller;
    address owner;
    bool listed;
    uint256 price;
  }

  struct Offer {
    bool exists;
    address buyer;
    uint256 price;
  }

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

  function makeOffer(
    address _tokenContract,
    uint256 _tokenId,
    uint256 _amount
  ) external;

  // function sellNFT(
  //   address _tokenContract,
  //   uint256 _tokenId,
  //   uint256 _amount
  // ) external;
}
